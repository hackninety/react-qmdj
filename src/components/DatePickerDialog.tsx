import { useState, useRef, useEffect, useMemo } from 'react';
import { X, CalendarDays, RotateCcw, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROVINCES } from '@/lib/cities';

export interface QimenOptions {
  date: Date;
  type: string;
  method: string;
  purpose: string;
  location: string;
}

interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (options: QimenOptions) => void;
  currentDate?: Date;
}

const TYPES = ['四柱', '三元'];
const METHODS = [
  { value: '时家', label: '时家奇门' },
  { value: '日家', label: '日家奇门' },
  { value: '月家', label: '月家奇门' },
  { value: '年家', label: '年家奇门' },
];
const PURPOSES = [
  { value: '综合', label: '综合分析' },
  { value: '事业', label: '事业' },
  { value: '财运', label: '财运' },
  { value: '婚姻', label: '婚姻' },
  { value: '健康', label: '健康' },
  { value: '学业', label: '学业' },
];

export function DatePickerDialog({ open, onClose, onConfirm, currentDate }: DatePickerDialogProps) {
  const now = currentDate || new Date();

  const pad = (n: number) => String(n).padStart(2, '0');
  const toLocalDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const toLocalTimeStr = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const [dateStr, setDateStr] = useState(toLocalDateStr(now));
  const [timeStr, setTimeStr] = useState(toLocalTimeStr(now));
  const [type, setType] = useState('四柱');
  const [method, setMethod] = useState('时家');
  const [purpose, setPurpose] = useState('综合');

  // 地点 — 省/市/区三级联动
  const [provinceIdx, setProvinceIdx] = useState(0);
  const [cityIdx, setCityIdx] = useState(0);
  const [districtIdx, setDistrictIdx] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => PROVINCES[provinceIdx]?.cities || [], [provinceIdx]);
  const districts = useMemo(() => cities[cityIdx]?.districts || [], [cityIdx, cities]);
  const locationName = useMemo(() => {
    const p = PROVINCES[provinceIdx]?.name || '';
    const c = cities[cityIdx]?.name || '';
    const d = districts[districtIdx]?.name || '';
    return `${p}${c}${d}`;
  }, [provinceIdx, cityIdx, districtIdx, cities, districts]);

  // 当弹窗打开时，同步日期
  useEffect(() => {
    if (open) {
      const d = currentDate || new Date();
      setDateStr(toLocalDateStr(d));
      setTimeStr(toLocalTimeStr(d));
    }
  }, [open, currentDate]);

  // 省变更时重置市和区
  useEffect(() => { setCityIdx(0); setDistrictIdx(0); }, [provinceIdx]);
  useEffect(() => { setDistrictIdx(0); }, [cityIdx]);

  // 点击遮罩关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Esc 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleConfirm = () => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    const date = new Date(y, m - 1, d, h, min);
    onConfirm({ date, type, method, purpose, location: locationName });
  };

  const handleResetNow = () => {
    const n = new Date();
    setDateStr(toLocalDateStr(n));
    setTimeStr(toLocalTimeStr(n));
  };

  const selectClass =
    'w-full px-3 py-2 rounded-lg bg-secondary/70 border border-border/50 text-foreground text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)]/50 ' +
    'transition-all [color-scheme:dark] appearance-none cursor-pointer';

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg bg-secondary/70 border border-border/50 text-foreground text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)]/50 ' +
    'transition-all [color-scheme:dark]';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={dialogRef}
            className="w-full max-w-md glass-card rounded-2xl border border-border/60 shadow-2xl shadow-black/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 sticky top-0 bg-card/90 backdrop-blur-lg z-10">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[var(--color-gold)]" />
                <h3 className="text-base font-semibold font-serif text-foreground">自定义排盘</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* 表单 */}
            <div className="px-5 py-4 space-y-3.5">
              {/* 排盘类型 & 方法 — 横排 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">排盘类型</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={selectClass}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">排盘方法</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className={selectClass}
                  >
                    {METHODS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 日期 & 时间 — 横排 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">日期</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">时间</label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* 地点 — 省/市/区三级联动 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  地点
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={provinceIdx}
                    onChange={(e) => setProvinceIdx(Number(e.target.value))}
                    className={selectClass}
                  >
                    {PROVINCES.map((p, i) => (
                      <option key={p.name} value={i}>{p.name}</option>
                    ))}
                  </select>
                  <select
                    value={cityIdx}
                    onChange={(e) => setCityIdx(Number(e.target.value))}
                    className={selectClass}
                  >
                    {cities.map((c, i) => (
                      <option key={c.name} value={i}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={districtIdx}
                    onChange={(e) => setDistrictIdx(Number(e.target.value))}
                    className={selectClass}
                  >
                    {districts.map((d, i) => (
                      <option key={d.name} value={i}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 目的 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">排盘目的</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className={selectClass}
                >
                  {PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border/30">
              <button
                onClick={handleResetNow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                当前时间
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-light)] transition-colors"
                >
                  起局
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
