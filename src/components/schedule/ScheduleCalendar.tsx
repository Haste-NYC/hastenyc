import { useState, useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, isSunday, isSaturday, isBefore, startOfDay, isToday, parseISO } from "date-fns";
import type { DayAvailability } from "@/hooks/useSchedule";
import { convertSlotToLocal } from "@/lib/timezone";

interface ScheduleCalendarProps {
  availability: DayAvailability[];
  isLoading: boolean;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onMonthChange: (startDate: string, endDate: string) => void;
}

const ScheduleCalendar = ({
  availability,
  isLoading,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onMonthChange,
}: ScheduleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const hasAutoSelected = useRef(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [slotsMaxH, setSlotsMaxH] = useState<number | undefined>();

  // Match time slots height to calendar height so the card never grows
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setSlotsMaxH(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch availability when month changes
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    onMonthChange(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  }, [currentMonth]);

  // Auto-select the first future date with available slots
  useEffect(() => {
    if (hasAutoSelected.current || selectedDate || availability.length === 0) return;
    const todayStr = format(today, "yyyy-MM-dd");
    const firstAvailable = availability.find(
      (d) => d.slots.length > 0 && d.date >= todayStr
    );
    if (firstAvailable) {
      hasAutoSelected.current = true;
      onDateSelect(parseISO(firstAvailable.date));
    }
  }, [availability, selectedDate, onDateSelect]);

  const today = startOfDay(new Date());

  // Get slots for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const dayData = availability.find((d) => d.date === selectedDateStr);
  const slots = dayData?.slots || [];
  const isSelectedToday = selectedDate ? isToday(selectedDate) : false;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar */}
        <div ref={calendarRef} className="flex-shrink-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            onMonthChange={setCurrentMonth}
            disabled={(date) =>
              isBefore(date, today) || isSunday(date) || isSaturday(date)
            }
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-white",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-white/5 border border-white/10 rounded-md p-0 opacity-70 hover:opacity-100 hover:bg-white/10 inline-flex items-center justify-center",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-white/40 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-white/10 inline-flex items-center justify-center text-white/70 aria-selected:opacity-100 transition-colors",
              day_range_end: "day-range-end",
              day_selected:
                "!bg-white/10 !border !border-white/40 !text-white",
              day_today: "bg-white/8 text-white",
              day_outside: "text-white/20 opacity-50",
              day_disabled: "text-white/10 opacity-30 cursor-not-allowed hover:bg-transparent",
              day_range_middle: "",
              day_hidden: "invisible",
            }}
            className="p-0"
          />
        </div>

        {/* Time Slots */}
        <div
          data-lenis-prevent
          className="flex-1 min-w-0 min-h-0 overflow-y-auto schedule-scrollbar"
          style={slotsMaxH ? { maxHeight: slotsMaxH } : undefined}
        >
          {!selectedDate ? (
            <div className="flex items-center justify-center h-full text-white/40 text-sm uppercase tracking-wider">
              Select a date
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg bg-white/5" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm uppercase tracking-wider gap-2">
              <span>{isSelectedToday ? "No remaining times today" : "No availability"}</span>
              {isSelectedToday && (
                <span className="text-xs normal-case tracking-normal">Select a future date to see open slots</span>
              )}
            </div>
          ) : (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-4">
                {dayData?.dayLabel}, {selectedDate && format(selectedDate, "MMMM d")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => {
                  const isActive = selectedTime === slot;
                  const displayTime = selectedDateStr
                    ? convertSlotToLocal(selectedDateStr, slot)
                    : slot;

                  return (
                    <button
                      key={slot}
                      onClick={() => onTimeSelect(slot)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? "bg-white/10 border-white/40 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
