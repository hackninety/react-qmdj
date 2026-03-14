export function BasicInfoPanel({ qMDJData }: { qMDJData: any }) {
  if (!qMDJData) {
    return (
      <div className="animate-pulse flex flex-col gap-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-8 bg-muted rounded w-full mt-2"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className="flex justify-between"><span>公历:</span> <span className="text-foreground">{qMDJData.basicInfo?.date}</span></p>
      <p className="flex justify-between"><span>农历:</span> <span className="text-foreground">{qMDJData.basicInfo?.lunarDate}</span></p>
      <div className="pt-2 pb-2">
        <div className="flex justify-between items-center bg-secondary rounded p-2">
          <span className="font-medium text-foreground">{qMDJData.siZhu?.year}</span>
          <span className="font-medium text-foreground">{qMDJData.siZhu?.month}</span>
          <span className="font-medium text-foreground">{qMDJData.siZhu?.day}</span>
          <span className="font-medium text-foreground">{qMDJData.siZhu?.time}</span>
        </div>
      </div>
      <p className="flex justify-between"><span>旬首:</span> <span className="text-foreground">{qMDJData.xunShou}</span></p>
      <p className="flex justify-between"><span>局数:</span> <span className="text-foreground">{qMDJData.juShu?.fullName}</span></p>
      <p className="flex justify-between">
        <span>值符:</span> 
        <span className="text-foreground">
          {qMDJData.zhiFuXing} ({qMDJData.zhiFuGong}宫)
        </span>
      </p>
      <p className="flex justify-between">
        <span>值使:</span> 
        <span className="text-foreground">
          {qMDJData.zhiShiMen} ({qMDJData.zhiShiGong}宫)
        </span>
      </p>
    </div>
  );
}
