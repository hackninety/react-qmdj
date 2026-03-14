import { cn } from '@/utils/cn';
import { getWuxingColorClass, getJiXiongBorderClass, getJiXiongBgClass } from '@/utils/qmdj-colors';

export interface GongProps {
  gongNumber: number; // 宫位数字，如 1..9
  gongName: string; // 宫位名，如 '坎', '坤'
  jiXiong?: string; // 吉凶标识: 'ji', 'xiong', 'da-ji', 'da-xiong', 'ping'
  diZhi?: string; // 暗干/地支
  baShen?: string; // 八神
  baMen?: string; // 八门
  jiuXing?: string; // 九星
  tianPan?: string; // 天盘干
  diPan?: string; // 地盘干
  isZhiFu?: boolean; // 是否值符宫
  isZhiShi?: boolean; // 是否值使宫
  showMaStar?: boolean; // 是否有马星
  showEmptyCircle?: boolean; // 是否空亡
  dayXunShou?: string; // 日旬首(判断击刑等)
}

export function Gong({
  gongNumber,
  gongName,
  jiXiong,
  diZhi,
  baShen,
  baMen,
  jiuXing,
  tianPan,
  diPan,
  isZhiFu,
  isZhiShi,
  showMaStar,
  showEmptyCircle,
  dayXunShou,
}: GongProps) {
  // 定义中宫(5)的特殊展示(通常寄放在坤2或者艮8，或者独立展示为中央)
  // 此处遵循经典九宫格布局(3x3)展示逻辑

  const isDayXunShou = tianPan && dayXunShou && tianPan === dayXunShou;

  return (
    <div
      className={cn(
        'relative aspect-square flex flex-col p-2 border rounded-xl shadow-sm transition-all',
        getJiXiongBorderClass(jiXiong || 'ping'),
        getJiXiongBgClass(jiXiong || 'ping'),
        isZhiFu && 'ring-2 ring-amber-400 dark:ring-amber-500 border-transparent',
        isZhiShi && !isZhiFu && 'ring-2 ring-blue-400 dark:ring-blue-500 border-transparent'
      )}
    >
      {/* 背景水印宫数 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none text-8xl font-black font-serif">
        {gongNumber}
      </div>

      {/* 顶部栏：(左)暗干地支 / (中)神 / (右)神煞符号(马/空) */}
      <div className="flex justify-between items-start text-xs font-semibold relative z-10">
        <span className="text-muted-foreground">{diZhi || '\u00A0'}</span>
        <span className={cn(getWuxingColorClass(baShen || ''))}>{baShen || '\u00A0'}</span>
        <div className="flex gap-1 shrink-0">
          {showMaStar && (
            <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500 flex items-center justify-center text-[10px] leading-none shrink-0">
              马
            </span>
          )}
          {showEmptyCircle && (
            <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500 flex items-center justify-center text-[10px] leading-none shrink-0">
              空
            </span>
          )}
          {!showMaStar && !showEmptyCircle && <span className="w-4 h-4 opacity-0"></span>}
        </div>
      </div>

      {/* 中心内容区：(左空) / (中)门、星 / (右)天盘干 */}
      <div className="flex-1 flex items-center justify-between relative z-10 mt-1 pb-1">
        <div className="w-4"></div> {/* 占位以达成平衡 */}
        <div className="flex flex-col items-center justify-center gap-1.5 font-bold text-lg md:text-xl">
           <span className={cn(getWuxingColorClass(baMen || ''))}>{baMen || '\u00A0'}</span>
           <span className={cn(getWuxingColorClass(jiuXing || ''))}>{jiuXing || '\u00A0'}</span>
        </div>
        <div className="h-full flex flex-col items-end">
           <span 
             className={cn(
               "text-xl font-bold font-serif leading-none mt-1", 
               getWuxingColorClass(tianPan || ''),
               isDayXunShou && "border border-current px-0.5"
             )}
           >
             {tianPan || '\u00A0'}
           </span>
        </div>
      </div>

      {/* 底部栏：(左)宫名 / (中)宫数字 / (右)地盘干 */}
      <div className="flex justify-between items-end text-sm relative z-10">
        <span className={cn("font-medium", getWuxingColorClass(gongName || ''))}>{gongName || '\u00A0'}</span>
        {/* <span className="text-muted-foreground/50 font-serif text-xs">{gongNumber}</span> */}
        <span className="w-4"></span> {/* 原先显示宫数的地方已被背景大字代替，或可改作他用 */}
        <span className={cn("text-lg font-bold font-serif leading-none", getWuxingColorClass(diPan || ''))}>{diPan || '\u00A0'}</span>
      </div>
      
      {/* 底部标志位：值符首/值使首 */}
      {(isZhiFu || isZhiShi) && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
          {isZhiFu && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm leading-none whitespace-nowrap">值符</span>}
          {isZhiShi && <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded shadow-sm leading-none whitespace-nowrap">值使</span>}
        </div>
      )}
    </div>
  );
}
