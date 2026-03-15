import { Compass, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

export function AnalysisPanel({ qMDJData }: { qMDJData: any }) {
  if (!qMDJData) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-5/6" />
      </div>
    );
  }

  const bestGong = qMDJData.analysis?.bestGong;
  const direction = bestGong ? qMDJData.jiuGongAnalysis?.[bestGong]?.direction : '-';
  const suggestions = qMDJData.analysis?.suggestions || [];

  return (
    <div className="space-y-4">
      {/* 最有利方位 */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
        <Compass className="w-5 h-5 text-[var(--color-gold)] shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">最有利方位</p>
          <p className="text-sm font-semibold text-[var(--color-gold)]">
            {direction} ({bestGong}宫)
          </p>
        </div>
      </div>

      {/* 建议列表 */}
      {suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.map((s: string, i: number) => {
            const Icon = i === 0 ? TrendingUp : i === suggestions.length - 1 ? Shield : AlertTriangle;
            return (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/50" />
                <p className="leading-relaxed">{s}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">暂无具体建议</p>
      )}
    </div>
  );
}
