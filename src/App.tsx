import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sun, Moon } from 'lucide-react';
import { QimenPan } from '@/components/QimenPan';
import { BasicInfoPanel } from '@/components/BasicInfoPanel';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { GongDetailPanel } from '@/components/GongDetailPanel';
import { JsonExportPanel } from '@/components/JsonExportPanel';
import { DatePickerDialog, type QimenOptions } from '@/components/DatePickerDialog';
import { toTrueSolarTime } from '@/utils/true-solar-time';
import * as qimen from '@/lib/qimen';

function App() {
  const [qMDJData, setQMDJData] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trueSolarInfo, setTrueSolarInfo] = useState<{ offsetMinutes: number; longitude: number } | null>(null);

  const doCalculate = useCallback((date: Date, opts?: Partial<QimenOptions>) => {
    try {
      const lng = opts?.longitude ?? 120; // 默认北京时间基准经度（无修正）
      const { trueSolarDate, offsetMinutes } = toTrueSolarTime(date, lng);

      const data = qimen.calculate(trueSolarDate, {
        type: opts?.type || '四柱',
        method: opts?.method || '时家',
        purpose: opts?.purpose || '综合',
        location: opts?.location || '默认位置'
      });
      setQMDJData(data);
      setSelectedDate(date);
      setTrueSolarInfo({ offsetMinutes, longitude: lng });
    } catch (error) {
      console.error('排盘计算失败:', error);
    }
  }, []);

  useEffect(() => {
    doCalculate(new Date());
  }, [doCalculate]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
    setIsDark(!isDark);
  };

  const handleDateConfirm = (options: QimenOptions) => {
    doCalculate(options.date, options);
    setPickerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)]/20 flex items-center justify-center">
              <span className="text-[var(--color-gold)] font-serif font-bold text-sm">奇</span>
            </div>
            <h1 className="text-lg font-bold font-serif tracking-widest text-foreground">
              奇门遁甲
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="切换主题"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
            >
              <CalendarDays className="w-4 h-4" />
              <span>自定义排盘</span>
            </button>
          </div>
        </div>
        {/* 金色底部装饰线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
      </header>

      {/* 主体 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">

        {/* 左侧信息栏 */}
        <motion.aside
          className="w-full lg:w-72 xl:w-80 space-y-4 shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="glass-card rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
              基础信息
            </h2>
            <BasicInfoPanel qMDJData={qMDJData} trueSolarInfo={trueSolarInfo} />
          </div>

          <div className="glass-card rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
              断局指引
            </h2>
            <AnalysisPanel qMDJData={qMDJData} />
          </div>

          <div className="glass-card rounded-xl p-4">
            <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
              数据导出 & AI 分析
            </h2>
            <JsonExportPanel qMDJData={qMDJData} trueSolarInfo={trueSolarInfo} />
          </div>
        </motion.aside>

        {/* 右侧九宫格 */}
        <section className="flex-1 flex flex-col items-center gap-6">
          <div className="w-full max-w-2xl">
            {qMDJData ? (
              <QimenPan qimenData={qMDJData} />
            ) : (
              <div className="glass-card rounded-xl min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">正在起局...</p>
                </div>
              </div>
            )}
          </div>

          {/* 九宫详解 */}
          {qMDJData && (
            <div className="w-full max-w-4xl glass-card rounded-xl p-4">
              <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
                九宫详解
              </h2>
              <GongDetailPanel qMDJData={qMDJData} />
            </div>
          )}
        </section>

      </main>

      {/* 底部 */}
      <footer className="text-center py-4 text-xs text-muted-foreground/50 border-t border-border/30">
        奇门遁甲排盘系统 · 算法引擎 v1.0
      </footer>

      {/* 自定义排盘弹窗 */}
      <DatePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleDateConfirm}
        currentDate={selectedDate}
      />
    </div>
  );
}

export default App;
