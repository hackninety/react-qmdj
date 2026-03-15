import { getWuxingColorClass } from '@/utils/qmdj-colors';

interface TrueSolarInfo {
  offsetMinutes: number;
  longitude: number;
}

export function BasicInfoPanel({ qMDJData, trueSolarInfo }: { qMDJData: any; trueSolarInfo?: TrueSolarInfo | null }) {
  if (!qMDJData) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-16 bg-secondary rounded w-full" />
      </div>
    );
  }

  const pillars = [
    { label: '年柱', value: qMDJData.siZhu?.year },
    { label: '月柱', value: qMDJData.siZhu?.month },
    { label: '日柱', value: qMDJData.siZhu?.day },
    { label: '时柱', value: qMDJData.siZhu?.time },
  ];

  const offsetSign = (trueSolarInfo?.offsetMinutes ?? 0) >= 0 ? '+' : '';
  const offsetStr = trueSolarInfo ? `${offsetSign}${trueSolarInfo.offsetMinutes.toFixed(1)}分` : '';

  return (
    <div className="space-y-4">
      {/* 日期信息 */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">公历</span>
          <span className="text-foreground font-medium">{qMDJData.basicInfo?.date}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">农历</span>
          <span className="text-foreground font-medium">{qMDJData.basicInfo?.lunarDate}</span>
        </div>
        {trueSolarInfo && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">真太阳时</span>
            <span className="text-xs text-[var(--color-gold)]">
              E{trueSolarInfo.longitude.toFixed(1)}° · {offsetStr}
            </span>
          </div>
        )}
      </div>

      {/* 四柱卡片 */}
      <div className="grid grid-cols-4 gap-1.5">
        {pillars.map((p) => {
          const gan = p.value?.charAt(0) || '';
          const zhi = p.value?.charAt(1) || '';
          return (
            <div key={p.label} className="flex flex-col items-center rounded-lg bg-secondary/50 border border-border/30 py-2 px-1">
              <span className="text-[10px] text-muted-foreground mb-1">{p.label}</span>
              <span className={`text-lg font-bold font-serif leading-none ${getWuxingColorClass(gan)}`}>{gan}</span>
              <div className="w-3 h-px bg-border/50 my-1" />
              <span className={`text-lg font-bold font-serif leading-none ${getWuxingColorClass(zhi)}`}>{zhi}</span>
            </div>
          );
        })}
      </div>

      {/* 局数信息 */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">旬首</span>
          <span className="text-foreground font-medium font-serif">{qMDJData.xunShou}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">局数</span>
          <span className="text-[var(--color-gold)] font-semibold">{qMDJData.juShu?.fullName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">值符</span>
          <span className="text-foreground font-medium">
            {qMDJData.zhiFuXing}
            <span className="text-muted-foreground text-xs ml-1">({qMDJData.zhiFuGong}宫)</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">值使</span>
          <span className="text-foreground font-medium">
            {qMDJData.zhiShiMen}
            <span className="text-muted-foreground text-xs ml-1">({qMDJData.zhiShiGong}宫)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
