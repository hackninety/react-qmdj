export function AnalysisPanel({ qMDJData }: { qMDJData: any }) {
  if (!qMDJData) {
    return (
      <div className="animate-pulse flex flex-col gap-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    );
  }
  
  const bestGong = qMDJData.analysis?.bestGong;
  const direction = bestGong ? qMDJData.jiuGongAnalysis?.[bestGong]?.direction : '-';
  
  return (
    <div className="text-sm">
      <p className="mb-2">
        最有利方位: <span className="font-medium text-foreground">
          {direction} ({bestGong}宫)
        </span>
      </p>
      {qMDJData.analysis?.suggestions?.length > 0 ? (
        <div className="space-y-1 text-muted-foreground mt-3">
          {qMDJData.analysis.suggestions.map((s: string, i: number) => (
            <p key={i} className="leading-relaxed relative pl-3 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-primary/40 before:rounded-full">
              {s}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic">暂无具体建议</p>
      )}
    </div>
  );
}
