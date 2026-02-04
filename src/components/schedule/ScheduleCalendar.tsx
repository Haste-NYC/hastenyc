import { useState, useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, isSunday, isBefore, startOfDay, isToday, parseISO } from "date-fns";
import type { DayAvailability } from "@/hooks/useSchedule";

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
        <div className="flex-shrink-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            onMonthChange={setCurrentMonth}
            disabled={(date) =>
              isBefore(date, today) || isSunday(date)
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
                "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600",
              day_today: "ring-1 ring-white/30 text-white",
              day_outside: "text-white/20 opacity-50",
              day_disabled: "text-white/10 opacity-30 cursor-not-allowed hover:bg-transparent",
              day_range_middle: "",
              day_hidden: "invisible",
            }}
            className="p-0"
          />
        </div>

        {/* Time Slots */}
        <div className="flex-1 min-w-0">
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
              <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                {slots.map((slot) => {
                  const isActive = selectedTime === slot;
                  // Format for display: "10:00" -> "10:00 AM"
                  const [h, m] = slot.split(":").map(Number);
                  const period = h >= 12 ? "PM" : "AM";
                  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
                  const displayTime = `${displayH}:${String(m).padStart(2, "0")} ${period}`;

                  return (
                    <button
                      key={slot}
                      onClick={() => onTimeSelect(slot)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white"
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
