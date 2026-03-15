import { useState, useRef, useEffect } from 'react';
import { X, CalendarDays, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  currentDate?: Date;
}

export function DatePickerDialog({ open, onClose, onConfirm, currentDate }: DatePickerDialogProps) {
  const now = currentDate || new Date();

  const pad = (n: number) => String(n).padStart(2, '0');
  const toLocalDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const toLocalTimeStr = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const [dateStr, setDateStr] = useState(toLocalDateStr(now));
  const [timeStr, setTimeStr] = useState(toLocalTimeStr(now));
  const dialogRef = useRef<HTMLDivElement>(null);

  // 当弹窗打开时，同步日期
  useEffect(() => {
    if (open) {
      const d = currentDate || new Date();
      setDateStr(toLocalDateStr(d));
      setTimeStr(toLocalTimeStr(d));
    }
  }, [open, currentDate]);

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
    onConfirm(date);
  };

  const handleResetNow = () => {
    const n = new Date();
    setDateStr(toLocalDateStr(n));
    setTimeStr(toLocalTimeStr(n));
  };

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
            className="w-full max-w-sm glass-card rounded-2xl border border-border/60 shadow-2xl shadow-black/40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
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
            <div className="px-5 py-5 space-y-4">
              {/* 日期 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">日期</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary/70 border border-border/50 text-foreground text-sm
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)]/50
                             transition-all [color-scheme:dark]"
                />
              </div>

              {/* 时间 */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">时间</label>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary/70 border border-border/50 text-foreground text-sm
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)]/50
                             transition-all [color-scheme:dark]"
                />
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
