import { getWuxingColorClass, getJiXiongIndicator } from '@/utils/qmdj-colors';

interface GongDetail {
  gongName?: string;
  direction?: string;
  xing?: string;
  xingAlias?: string;
  men?: string;
  shen?: string;
  jiXiong?: string;
  jiXiongText?: string;
  explain?: string;
}

export function GongDetailPanel({ qMDJData }: { qMDJData: any }) {
  if (!qMDJData?.jiuGongAnalysis) {
    return <p className="text-center text-muted-foreground text-sm">暂无九宫分析数据</p>;
  }

  const gongs = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {gongs.map((i) => {
        const detail: GongDetail = qMDJData.jiuGongAnalysis[i];
        if (!detail) return null;

        const indicator = getJiXiongIndicator(detail.jiXiong || 'ping');
        const sanQi = qMDJData.sanQiLiuYi?.[i] || '';

        return (
          <div
            key={i}
            className="glass-card rounded-xl overflow-hidden border border-border/40"
          >
            {/* 宫位标题 */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-secondary/30">
              <span className="text-sm font-semibold font-serif text-foreground">
                {i}宫 · {detail.gongName || ''}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  indicator.label.includes('吉')
                    ? 'bg-green-500/15 text-green-400'
                    : indicator.label === '平'
                      ? 'bg-muted-foreground/15 text-muted-foreground'
                      : 'bg-red-500/15 text-red-400'
                }`}
              >
                {indicator.label}
              </span>
            </div>

            {/* 宫位内容 */}
            <div className="px-3 py-2.5 space-y-1.5 text-xs">
              <div className="flex gap-4">
                <span className="text-muted-foreground">方位</span>
                <span className="text-foreground">{detail.direction || '-'}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">九星</span>
                <span className={getWuxingColorClass(detail.xing || '')}>
                  {detail.xing || '-'}
                  {detail.xingAlias && <span className="text-muted-foreground ml-1">({detail.xingAlias})</span>}
                </span>
              </div>
              {detail.men && (
                <div className="flex gap-4">
                  <span className="text-muted-foreground">八门</span>
                  <span className={getWuxingColorClass(detail.men)}>{detail.men}</span>
                </div>
              )}
              {detail.shen && (
                <div className="flex gap-4">
                  <span className="text-muted-foreground">八神</span>
                  <span className={getWuxingColorClass(detail.shen)}>{detail.shen}</span>
                </div>
              )}
              {sanQi && (
                <div className="flex gap-4">
                  <span className="text-muted-foreground">天盘</span>
                  <span className={`font-serif font-bold ${getWuxingColorClass(sanQi)}`}>{sanQi}</span>
                </div>
              )}
              {detail.explain && (
                <p className="text-muted-foreground/80 pt-1 border-t border-border/20 leading-relaxed">
                  {detail.explain}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
