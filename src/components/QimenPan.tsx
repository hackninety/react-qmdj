import { motion } from 'framer-motion';
import { Gong } from './Gong';

interface QimenPanProps {
  qimenData: any;
}

export function QimenPan({ qimenData }: QimenPanProps) {
  if (!qimenData || !qimenData.jiuGongAnalysis) return null;

  // 奇门遁甲洛书九宫标准排序 (对应CSS Grid 3x3)
  // 第一排：巽4  离9  坤2
  // 第二排：震3  中5  兑7
  // 第三排：艮8  坎1  乾6
  const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 外框容器 — 深色圆角边框 */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg shadow-black/20">
        <div className="grid grid-cols-3 grid-rows-3 divide-x divide-y divide-border/30">
          {gridOrder.map((gongNum, index) => {
            const analysis = qimenData.jiuGongAnalysis[gongNum] || {};

            return (
              <motion.div
                key={gongNum}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.04,
                  ease: 'easeOut',
                }}
              >
                <Gong
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
