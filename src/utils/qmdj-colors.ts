// 五行及其对应元素颜色的映射辅助函数
export const getWuxingColorClass = (elementStr: string) => {
  if (!elementStr) return '';
  
  if (['木', '震', '巽', '甲', '乙', '天冲', '天辅', '生门', '伤门', '值符', '六合'].some(x => elementStr.includes(x))) {
    return 'text-green-600 dark:text-green-400';
  }
  if (['火', '离', '丙', '丁', '天英', '景门', '腾蛇'].some(x => elementStr.includes(x))) {
    return 'text-red-500 dark:text-red-400';
  }
  if (['土', '坤', '艮', '中', '戊', '己', '天芮', '天禽', '天任', '禽', '芮', '死门', '杜门', '九地'].some(x => elementStr.includes(x))) {
    return 'text-amber-600 dark:text-amber-500';
  }
  if (['金', '乾', '兑', '庚', '辛', '天柱', '天心', '惊门', '开门', '太阴', '白虎', '九天'].some(x => elementStr.includes(x))) {
    return 'text-yellow-500 dark:text-yellow-400'; // 或者金黄色/浅色
  }
  if (['水', '坎', '壬', '癸', '天蓬', '休门', '玄武'].some(x => elementStr.includes(x))) {
    return 'text-blue-500 dark:text-blue-400';
  }
  
  return 'text-foreground';
};

export const getJiXiongColorClass = (jiXiong: string) => {
  if (!jiXiong) return 'qmdj-ping';
  if (jiXiong.includes('ji') && !jiXiong.includes('xiong')) return 'qmdj-ji';
  if (jiXiong.includes('xiong')) return 'qmdj-xiong';
  return 'qmdj-ping';
};

export const getJiXiongBorderClass = (jiXiong: string) => {
  if (!jiXiong) return 'border-border';
  if (jiXiong.includes('ji') && !jiXiong.includes('xiong')) return 'border-green-500/50 dark:border-green-400/50';
  if (jiXiong.includes('xiong')) return 'border-red-500/50 dark:border-red-400/50';
  return 'border-border';
};

export const getJiXiongBgClass = (jiXiong: string) => {
  if (!jiXiong) return 'bg-card';
  if (jiXiong.includes('ji') && !jiXiong.includes('xiong')) return 'bg-green-50/50 dark:bg-green-950/20';
  if (jiXiong.includes('xiong')) return 'bg-red-50/50 dark:bg-red-950/20';
  return 'bg-card';
};
