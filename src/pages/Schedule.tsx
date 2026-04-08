import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Video, Globe } from "lucide-react";
import { getUserTimezoneName } from "@/lib/timezone";
import Header from "@/components/Header";

import SEO from "@/components/SEO";
import ScheduleCalendar from "@/components/schedule/ScheduleCalendar";
import BookingForm from "@/components/schedule/BookingForm";
import ConfirmationView from "@/components/schedule/ConfirmationView";
import { useSchedule } from "@/hooks/useSchedule";
import { format } from "date-fns";
import type { DayAvailability, BookingConfirmation } from "@/hooks/useSchedule";

type Step = "select" | "form" | "confirmation";

// Page atmosphere -- single subtle blob for shorter page
const PageAtmosphere = () => (
  <div
    className="absolute left-0 right-0 top-0 pointer-events-none z-0"
    style={{
      height: "2400px",
      background:
        "radial-gradient(ellipse 120% 70% at 50% 30%, rgba(80, 130, 255, 0.09) 0%, rgba(80, 130, 255, 0.025) 30%, transparent 60%)",
    }}
  />
);

const Schedule = () => {
  const [step, setStep] = useState<Step>("select");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [bookedName, setBookedName] = useState("");

  const { isLoadingAvailability, isBooking, fetchAvailability, bookAppointment } = useSchedule();

  const handleMonthChange = useCallback(
    async (startDate: string, endDate: string) => {
      const result = await fetchAvailability(startDate, endDate);
      if (result) {
        setAvailability(result.days);
      }
    },
    [fetchAvailability]
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("form");
    window.history.pushState({ step: "form" }, "");
  };

  // Browser back button returns to calendar
  useEffect(() => {
    const handlePopState = () => {
      if (step === "form") {
        setStep("select");
      } else if (step === "confirmation") {
        setStep("select");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep("form");
    }
  };

  const handleBookingSubmit = async (data: { name: string; email: string; company?: string; notes?: string }) => {
    if (!selectedDate || !selectedTime) return;

    const result = await bookAppointment({
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      name: data.name,
      email: data.email,
      company: data.company,
      notes: data.notes,
    });

    if (result) {
      setBookedName(data.name);
      setConfirmation(result);
      setStep("confirmation");
    }
  };

  return (
    <div className="h-screen md:min-h-screen bg-background overflow-x-hidden overflow-y-auto md:overflow-y-visible relative">
      <SEO
        title="Schedule Demo"
        description="Book a 30-minute demo of Haste Conform Studio. See how AI-powered timeline migration works for your post-production workflow."
        canonical="/schedule"
      />
      <PageAtmosphere />
      <Header />

      <main className="relative z-10 pt-16 md:pt-32 pb-4 md:pb-24 px-4 sm:px-6 h-[calc(100vh-52px)] md:h-auto flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* Section Label & Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 md:mb-12"
          >
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-2 md:mb-4">
              [ Schedule Call ]
            </p>

            {/* Info Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-2 md:mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                <Clock className="w-3.5 h-3.5" />
                30 min
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                <Video className="w-3.5 h-3.5" />
                Google Meet
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                <Globe className="w-3.5 h-3.5" />
                {getUserTimezoneName()}
              </span>
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto min-h-0 md:overflow-visible md:flex-none"
              >
                <ScheduleCalendar
                  availability={availability}
                  isLoading={isLoadingAvailability}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateSelect={handleDateSelect}
                  onTimeSelect={handleTimeSelect}
                  onMonthChange={handleMonthChange}
                />

                {/* Email fallback */}
                <p className="text-center text-white/40 text-sm mt-6">
                  or{" "}
                  <a
                    href="mailto:jordan@haste.nyc"
                    className="text-white/60 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    send us an email
                  </a>
                </p>

              </motion.div>
            )}

            {step === "form" && selectedDate && selectedTime && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <BookingForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  isSubmitting={isBooking}
                  onSubmit={handleBookingSubmit}
                  onBack={() => setStep("select")}
                />
              </motion.div>
            )}

            {step === "confirmation" && confirmation && selectedDate && selectedTime && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ConfirmationView
                  confirmation={confirmation}
                  bookedName={bookedName}
                  bookedDate={selectedDate}
                  bookedTime={selectedTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>


    </div>
  );
};

export default Schedule;
