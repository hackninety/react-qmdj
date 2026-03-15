/**
 * 五行颜色映射工具
 * 基于 QMDJ 要素返回 Tailwind CSS 颜色类
 */

// 五行颜色 (使用 CSS 自定义属性)
const WUXING_CLASSES: Record<string, string> = {
  // 木 — 绿
  mu: 'text-[var(--color-wood)]',
  // 火 — 红
  huo: 'text-[var(--color-fire)]',
  // 土 — 土黄
  tu: 'text-[var(--color-earth)]',
  // 金 — 金
  jin: 'text-[var(--color-metal)]',
  // 水 — 蓝
  shui: 'text-[var(--color-water)]',
};

// 元素名称 → 五行 映射
const ELEMENT_MAP: Record<string, string> = {
  // 天干
  '甲': 'mu', '乙': 'mu',
  '丙': 'huo', '丁': 'huo',
  '戊': 'tu', '己': 'tu',
  '庚': 'jin', '辛': 'jin',
  '壬': 'shui', '癸': 'shui',
  // 地支
  '子': 'shui', '丑': 'tu', '寅': 'mu', '卯': 'mu',
  '辰': 'tu', '巳': 'huo', '午': 'huo', '未': 'tu',
  '申': 'jin', '酉': 'jin', '戌': 'tu', '亥': 'shui',
  // 八卦/宫名
  '坎': 'shui', '坤': 'tu', '震': 'mu', '巽': 'mu',
  '中': 'tu', '乾': 'jin', '兑': 'jin', '艮': 'tu', '离': 'huo',
  // 九星
  '天蓬': 'shui', '天芮': 'tu', '天冲': 'mu', '天辅': 'mu',
  '天禽': 'tu', '天心': 'jin', '天柱': 'jin', '天任': 'tu', '天英': 'huo',
  '禽芮': 'tu',
  // 八门
  '休门': 'shui', '生门': 'mu', '伤门': 'mu', '杜门': 'tu',
  '景门': 'huo', '死门': 'tu', '惊门': 'jin', '开门': 'jin',
  // 八神
  '值符': 'tu', '腾蛇': 'huo', '太阴': 'jin', '六合': 'mu',
  '白虎': 'jin', '玄武': 'shui', '九地': 'tu', '九天': 'jin',
};

export const getWuxingColorClass = (name: string): string => {
  if (!name) return '';
  // 直接查找
  if (ELEMENT_MAP[name]) return WUXING_CLASSES[ELEMENT_MAP[name]] || '';
  // 部分匹配
  for (const [key, wuxing] of Object.entries(ELEMENT_MAP)) {
    if (name.includes(key)) return WUXING_CLASSES[wuxing] || '';
  }
  return 'text-foreground';
};

export const getWuxingElement = (name: string): string => {
  if (!name) return '';
  if (ELEMENT_MAP[name]) return ELEMENT_MAP[name];
  for (const [key, wuxing] of Object.entries(ELEMENT_MAP)) {
    if (name.includes(key)) return wuxing;
  }
  return '';
};

export const getJiXiongBorderClass = (jiXiong: string): string => {
  if (!jiXiong) return 'border-border';
  if (jiXiong === 'da-ji') return 'border-[var(--color-wood)]/60';
  if (jiXiong === 'ji') return 'border-[var(--color-wood)]/40';
  if (jiXiong === 'da-xiong') return 'border-[var(--color-fire)]/60';
  if (jiXiong === 'xiong') return 'border-[var(--color-fire)]/40';
  return 'border-border';
};

export const getJiXiongIndicator = (jiXiong: string): { color: string; label: string } => {
  if (jiXiong === 'da-ji') return { color: 'bg-green-500', label: '大吉' };
  if (jiXiong === 'ji') return { color: 'bg-green-500/70', label: '吉' };
  if (jiXiong === 'da-xiong') return { color: 'bg-red-500', label: '大凶' };
  if (jiXiong === 'xiong') return { color: 'bg-red-500/70', label: '凶' };
  return { color: 'bg-muted-foreground/30', label: '平' };
};
