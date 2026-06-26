import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'motion/react';
import { useState } from 'react';
import { X, CalendarPlus, Check } from 'lucide-react';
import { CalendarEvent } from '@/types/types';
import { EVENT_COLOR_MAP } from '@/constants/data';
import { cn } from '@/lib/utils';

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: (event: CalendarEvent) => void;
}

const COLOR_OPTIONS: CalendarEvent['color'][] = ['cyan', 'purple', 'rose', 'amber', 'teal'];

const FIELD_CLASS = "w-full px-3 py-2 rounded-xl font-inter text-[0.82rem] bg-white/[0.05] border border-cyan-primary/15 text-foreground outline-none focus:border-cyan-primary/50 transition-colors";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-1.5 font-mono-tech text-[0.6rem] tracking-[0.08em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export function EventFormModal({ open, onClose, onEventCreated }: EventFormModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('cyan');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    const newEvent: CalendarEvent = {
      id: `e-${Date.now()}`,
      group_id: 'mock-group',
      creator_id: 'mock-user',
      created_at: new Date().toISOString(),
      title,
      event_date: date,
      event_time: time,
      description,
      color,
    };

    setSaved(true);
    await new Promise((r) => setTimeout(r, 700));
    onEventCreated(newEvent);
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
    setColor('cyan');
    setSaved(false);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass-overlay"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <Dialog.Title className="sr-only">New Event</Dialog.Title>
            <Dialog.Description className="sr-only">Create a new calendar event.</Dialog.Description>
            <div
              className="w-full max-w-md rounded-2xl overflow-hidden bg-[#0f0f12]/95 border border-cyan-primary/20 shadow-[0_0_60px_rgba(0,217,255,0.1),0_32px_64px_rgba(0,0,0,0.6)]"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-cyan-primary/10"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-primary/[0.12] border border-cyan-primary/25"
                  >
                    <CalendarPlus size={15} className="text-cyan-primary" />
                  </div>
                  <h2
                    className="font-bungee text-[0.95rem] tracking-[-0.01em] text-foreground"
                  >
                    NEW EVENT
                  </h2>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <Field label="EVENT TITLE *">
                  <input
                    type="text"
                    placeholder="e.g. Golden Hour Shoot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={FIELD_CLASS}
                  />
                </Field>

                {/* Date + Time row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="DATE *">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className={cn(FIELD_CLASS, "color-scheme-dark")}
                    />
                  </Field>
                  <Field label="TIME *">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className={cn(FIELD_CLASS, "color-scheme-dark")}
                    />
                  </Field>
                </div>

                {/* Description */}
                <Field label="DESCRIPTION">
                  <textarea
                    placeholder="Optional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={cn(FIELD_CLASS, "resize-none")}
                  />
                </Field>

                {/* Color */}
                <Field label="EVENT COLOR">
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((c) => {
                      const colors = EVENT_COLOR_MAP[c];
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110", colors.dotClass, color === c ? "border-2 border-white" : "border-2 border-transparent")}
                          style={{ boxShadow: color === c ? '0 0 10px currentColor' : 'none' }}
                        >
                          {color === c && <Check size={12} className="text-[#0A0A0B]" />}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Preview strip */}
                {title && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("rounded-lg px-3 py-2 flex items-center gap-2 border", EVENT_COLOR_MAP[color].bgClass, EVENT_COLOR_MAP[color].borderClass)}
                  >
                    <div
                      className={cn("w-2 h-2 rounded-full shrink-0", EVENT_COLOR_MAP[color].dotClass)}
                    />
                    <span
                      className="font-inter text-[0.78rem] font-medium text-foreground"
                    >
                      {title}
                    </span>
                    {date && time && (
                      <span
                        className={cn("ml-auto font-mono-tech text-[0.62rem]", EVENT_COLOR_MAP[color].textClass)}
                      >
                        {date} · {time}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn("w-full py-3 rounded-xl flex items-center justify-center gap-2 font-inter font-semibold text-[0.85rem] transition-colors duration-300", saved ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-[#0A0A0B]" : "bg-gradient-to-br from-cyan-primary to-cyan-dim text-[#0A0A0B]")}
                >
                  {saved ? (
                    <>
                      <Check size={16} />
                      Event Created!
                    </>
                  ) : (
                    <>
                      <CalendarPlus size={16} />
                      Create Event
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
