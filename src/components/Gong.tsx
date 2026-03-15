import { cn } from '@/utils/cn';
import { getWuxingColorClass, getJiXiongIndicator } from '@/utils/qmdj-colors';

export interface GongProps {
  gongNumber: number;
  gongName: string;
  jiXiong?: string;
  diZhi?: string;       // 暗干
  baShen?: string;      // 八神
  baMen?: string;       // 八门
  jiuXing?: string;     // 九星
  tianPan?: string;     // 天盘干
  diPan?: string;       // 地盘干
  isZhiFu?: boolean;    // 值符宫
  isZhiShi?: boolean;   // 值使宫
  showMaStar?: boolean;
  showEmptyCircle?: boolean;
  dayXunShou?: string;
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
  const indicator = getJiXiongIndicator(jiXiong || 'ping');
  const isDayXunShou = tianPan && dayXunShou && tianPan === dayXunShou;

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between p-2.5 md:p-3 min-h-[130px]',
        'bg-card/60 backdrop-blur-sm',
        'border border-border/50',
        'transition-all duration-200',
        'hover:bg-card/80 hover:border-border',
        gongNumber === 5 && 'bg-card/30',
      )}
    >
      {/* 吉凶竖条指示器 */}
      <div className={cn('absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full', indicator.color)} />

      {/* 值符/值使标记 */}
      {(isZhiFu || isZhiShi) && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
          {isZhiFu && (
            <span className="text-[9px] bg-[var(--color-gold)] text-black px-1 py-px rounded-b font-medium leading-tight">符</span>
          )}
          {isZhiShi && (
            <span className="text-[9px] bg-blue-500 text-white px-1 py-px rounded-b font-medium leading-tight">使</span>
          )}
        </div>
      )}

      {/* 背景水印宫数 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-7xl md:text-8xl font-black font-serif text-foreground/[0.03] select-none">
          {gongNumber}
        </span>
      </div>

      {/* 上行：暗干 | 八神 | 马空 */}
      <div className="flex items-start justify-between text-xs relative z-10">
        <span className="text-muted-foreground font-serif">{diZhi || '\u00A0'}</span>
        <span className={cn('font-medium', getWuxingColorClass(baShen || ''))}>{baShen || '\u00A0'}</span>
        <div className="flex gap-0.5 shrink-0">
          {showMaStar && (
            <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 flex items-center justify-center text-[9px] font-bold">
              马
            </span>
          )}
          {showEmptyCircle && (
            <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 flex items-center justify-center text-[9px] font-bold">
              空
            </span>
          )}
          {!showMaStar && !showEmptyCircle && <span className="w-4 h-4" />}
        </div>
      </div>

      {/* 中心：天盘干 | 八门+九星 | 地盘干 (垂直 & 水平居中) */}
      <div className="flex-1 flex items-center justify-center relative z-10 my-1">
        {/* 天盘干 (左上) */}
        <div className="absolute top-0 right-0">
          <span
            className={cn(
              'text-xl md:text-2xl font-bold font-serif leading-none',
              getWuxingColorClass(tianPan || ''),
              isDayXunShou && 'ring-1 ring-current px-0.5 rounded-sm'
            )}
          >
            {tianPan || '\u00A0'}
          </span>
        </div>

        {/* 门 + 星 (居中) */}
        <div className="flex flex-col items-center gap-0.5">
          <span className={cn('text-lg md:text-xl font-bold font-serif', getWuxingColorClass(baMen || ''))}>
            {baMen || '\u00A0'}
          </span>
          <span className={cn('text-sm md:text-base font-semibold', getWuxingColorClass(jiuXing || ''))}>
            {jiuXing || '\u00A0'}
          </span>
        </div>
      </div>

      {/* 下行：宫名 | 地盘干 */}
      <div className="flex items-end justify-between relative z-10">
        <span className={cn('text-xs font-serif font-medium', getWuxingColorClass(gongName || ''))}>
          {gongName || '\u00A0'}
        </span>
        <span className={cn('text-lg md:text-xl font-bold font-serif leading-none', getWuxingColorClass(diPan || ''))}>
          {diPan || '\u00A0'}
        </span>
      </div>
    </div>
  );
}
