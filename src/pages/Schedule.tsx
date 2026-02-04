import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Video, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  };

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
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Schedule a Demo"
        description="Book a 30-minute demo of Haste Conform Studio. See how AI-powered timeline migration works for your post-production workflow."
        canonical="/schedule"
      />
      <PageAtmosphere />
      <Header />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Label & Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">
              [ Schedule ]
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Conform Studio | Demo
            </h1>

            {/* Info Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
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
                Central Time
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

                {/* Continue button */}
                {selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <button
                      onClick={handleContinue}
                      className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold text-sm transition-all"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
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

      <Footer />
    </div>
  );
};

export default Schedule;
