import { Gong } from './Gong';

interface QimenPanProps {
  qimenData: any;
}

export function QimenPan({ qimenData }: QimenPanProps) {
  if (!qimenData || !qimenData.jiuGongAnalysis) return null;

  // 奇门遁甲洛书九宫标准排序 (对应CSS Grid 3x3)
  // 第一排：4 9 2
  // 第二排：3 5 7
  // 第三排：8 1 6
  const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <div className="w-full max-w-lg aspect-square">
      <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full">
        {gridOrder.map((gongNum) => {
          const analysis = qimenData.jiuGongAnalysis[gongNum] || {};
          
          return (
            <Gong
              key={gongNum}
              gongNumber={gongNum}
              gongName={analysis.gongName || ''}
              jiXiong={analysis.jiXiong || 'ping'}
              baShen={qimenData.baShen?.[gongNum] || ''}
              baMen={qimenData.baMen?.[gongNum] || ''}
              jiuXing={qimenData.jiuXing?.[gongNum] || ''}
              tianPan={qimenData.sanQiLiuYi?.[gongNum] || ''}
              diPan={qimenData.diPan?.[gongNum] || ''}
              diZhi={qimenData.anGan?.[gongNum] || ''}
              isZhiFu={qimenData.zhiFuGong === String(gongNum)}
              isZhiShi={qimenData.zhiShiGong === String(gongNum)}
              showMaStar={qimenData.maStar?.gong === String(gongNum)}
              showEmptyCircle={qimenData.kongWangGong?.includes(String(gongNum))}
              dayXunShou={qimenData.dayXunShou}
            />
          );
        })}
      </div>
    </div>
  );
}
