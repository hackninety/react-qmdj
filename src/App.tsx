import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sun, Moon } from 'lucide-react';
import { QimenPan } from '@/components/QimenPan';
import { BasicInfoPanel } from '@/components/BasicInfoPanel';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { GongDetailPanel } from '@/components/GongDetailPanel';
import { JsonExportPanel } from '@/components/JsonExportPanel';
import { DatePickerDialog, type QimenOptions } from '@/components/DatePickerDialog';
import { toTrueSolarTime, toBeijingTime } from '@/utils/true-solar-time';
import * as qimen from '@/lib/qimen';

function App() {
  const [qMDJData, setQMDJData] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trueSolarInfo, setTrueSolarInfo] = useState<{ offsetMinutes: number; longitude: number; trueSolarDate: Date } | null>(null);

  // 默认排盘：使用本地系统时间，不做时区转换或真太阳时修正
  const doCalculate = useCallback((date: Date) => {
    try {
      // 通过系统时区获取当前地区（如 "Asia/Tokyo"）
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '未知时区';
      const data = qimen.calculate(date, {
        type: '四柱',
        method: '时家',
        purpose: '综合',
        location: tz
      });
      setQMDJData(data);
      setSelectedDate(date);
      setTrueSolarInfo(null); // 默认模式不显示真太阳时
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

  // 自定义排盘：转换为北京时间 → 真太阳时修正
  const handleDateConfirm = (options: QimenOptions) => {
    try {
      const beijingDate = toBeijingTime(options.date);
      const lng = options.longitude;
      const { trueSolarDate, offsetMinutes } = toTrueSolarTime(beijingDate, lng);

      const data = qimen.calculate(trueSolarDate, {
        type: options.type,
        method: options.method,
        purpose: options.purpose,
        location: options.location
      });
      setQMDJData(data);
      setSelectedDate(options.date);
      setTrueSolarInfo({ offsetMinutes, longitude: lng, trueSolarDate });
    } catch (error) {
      console.error('自定义排盘计算失败:', error);
    }
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

      {/* 主体 — 单列从上到下排列 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">

        {/* 基础信息 */}
        <motion.div
          className="glass-card rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
            基础信息
          </h2>
          <BasicInfoPanel qMDJData={qMDJData} trueSolarInfo={trueSolarInfo} originalDate={selectedDate} />
        </motion.div>

        {/* 九宫格 */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
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
        </motion.div>

        {/* 断局指引 */}
        <motion.div
          className="glass-card rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
            断局指引
          </h2>
          <AnalysisPanel qMDJData={qMDJData} />
        </motion.div>

        {/* 九宫详解 */}
        {qMDJData && (
          <motion.div
            className="glass-card rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
              九宫详解
            </h2>
            <GongDetailPanel qMDJData={qMDJData} />
          </motion.div>
        )}

        {/* 数据导出 & AI 分析 */}
        {qMDJData && (
          <motion.div
            className="glass-card rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[var(--color-gold)]" />
              数据导出 & AI 分析
            </h2>
            <JsonExportPanel qMDJData={qMDJData} trueSolarInfo={trueSolarInfo} />
          </motion.div>
        )}

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
