import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '@/types/types';
import { EVENT_COLOR_MAP } from '@/constants/data';
import { cn } from '@/lib/utils';

interface EventsPanelProps {
  events: CalendarEvent[];
  onNewEvent: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function MiniCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date(2026, 5, 25); // June 25, 2026
  const [viewDate, setViewDate] = useState(new Date(2026, 5, 1));

  const eventDates = new Set(events.map((e) => e.event_date));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const goBack = () => setViewDate(new Date(year, month - 1, 1));
  const goForward = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="rounded-xl p-3 mb-4 bg-white/[0.03] border border-cyan-primary/10">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goBack}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/5 text-muted-foreground"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="font-bungee text-[0.75rem] tracking-[-0.01em] text-foreground">
          {MONTH_NAMES[month].toUpperCase()} {year}
        </span>
        <button
          onClick={goForward}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white/5 text-muted-foreground"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center font-mono-tech text-[0.6rem] text-muted-foreground pb-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasEvent = eventDates.has(dateStr);
          const isToday =
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <div
                className={cn("w-6 h-6 flex items-center justify-center rounded-full relative border", isToday ? "bg-cyan-primary/20 border-cyan-primary/50" : "bg-transparent border-transparent")}
              >
                <span className={cn("font-bungee text-[0.6rem]", isToday ? "text-cyan-primary" : day <= today.getDate() && month <= today.getMonth() && year <= today.getFullYear() ? "text-foreground" : "text-muted-foreground")}>
                  {day}
                </span>
              </div>
              {hasEvent && (
                <div className="w-1 h-1 rounded-full mt-0.5 bg-cyan-primary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventItem({ event }: { event: CalendarEvent }) {
  const [expanded, setExpanded] = useState(false);
  const colors = EVENT_COLOR_MAP[event.color];
  const dateObj = new Date(event.event_date + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      layout
      className={cn("rounded-lg overflow-hidden cursor-pointer mb-2 border transition-colors duration-200", colors.bgClass, colors.borderClass, expanded ? "border-opacity-50" : "hover:border-opacity-40")}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="px-3 py-2.5 flex items-start gap-2.5">
        <div
          className={cn("w-2 h-2 rounded-full mt-1 shrink-0", colors.dotClass, colors.shadowClass)}
        />
        <div className="flex-1 min-w-0">
          <p className="truncate font-inter text-[0.8rem] font-medium text-foreground">
            {event.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono-tech text-[0.65rem] text-muted-foreground">
              {formattedDate}
            </span>
            <span className="text-muted-foreground text-[0.65rem]">·</span>
            <span className={cn("font-mono-tech text-[0.65rem]", colors.textClass)}>
              {event.event_time}
            </span>
          </div>
        </div>
        <Clock size={12} className={cn("opacity-70 mt-0.5 shrink-0", colors.textClass)} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-3 pb-3 font-inter text-[0.75rem] text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EventsPanel({ events, onNewEvent }: EventsPanelProps) {
  const upcoming = [...events].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-cyan-primary" />
          <span className="font-bungee text-[0.8rem] tracking-[-0.01em] text-foreground">
            SCHEDULE
          </span>
        </div>
        <motion.button
          onClick={onNewEvent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-inter text-[0.72rem] font-medium text-cyan-primary bg-cyan-primary/10 border border-cyan-primary/25"
        >
          <Plus size={12} />
          New
        </motion.button>
      </div>

      {/* Mini calendar */}
      <MiniCalendar events={events} />

      {/* Upcoming label */}
      <p className="mb-2 font-mono-tech text-[0.65rem] tracking-[0.08em] text-muted-foreground">
        UPCOMING ({upcoming.length})
      </p>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto">
        {upcoming.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
        {upcoming.length === 0 && (
          <div className="text-center py-8">
            <p className="font-inter text-[0.75rem] text-muted-foreground">
              No upcoming events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
