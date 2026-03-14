import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { QimenPan } from '@/components/QimenPan';
import { BasicInfoPanel } from '@/components/BasicInfoPanel';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import * as qimen from '@/lib/qimen';

function App() {
  const [qMDJData, setQMDJData] = useState<any>(null);

  useEffect(() => {
    // 组件加载时先计算当前时间的盘
    const now = new Date();
    try {
      const data = qimen.calculate(now, {
        type: '四柱',
        method: '时家',
        purpose: '综合',
        location: '默认位置'
      });
      setQMDJData(data);
    } catch (error) {
      console.error('Initial calculation failed:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航区 */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wider">奇门遁甲</h1>
          <div className="flex gap-4">
             {/* 此处可放置时间选择等 */}
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">
               <CalendarDays className="w-4 h-4" />
               <span className="text-sm">自定义排盘</span>
             </button>
          </div>
        </div>
      </header>

      {/* 主体排版区 */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col md:flex-row gap-6">
        
        {/* 左侧/顶部 基础信息与分析 */}
        <aside className="w-full md:w-80 space-y-4 shrink-0">
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-3 border-b border-border pb-2">基础信息</h2>
            <BasicInfoPanel qMDJData={qMDJData} />
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-3 border-b border-border pb-2">断局指引</h2>
             <AnalysisPanel qMDJData={qMDJData} />
          </div>
        </aside>

        {/* 右侧/主体 九宫格排盘区域 */}
        <section className="flex-1 flex justify-center items-start">
           <div className="max-w-2xl w-full bg-card rounded-xl border border-border p-6 shadow-sm min-h-[500px] flex justify-center items-center">
             {qMDJData ? (
               <QimenPan qimenData={qMDJData} />
             ) : (
                <div className="text-center text-muted-foreground animate-pulse">
                  <p>正在起局...</p>
                </div>
             )}
           </div>
        </section>

      </main>
    </div>
  );
}

export default App;
