import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  isSubmitting: boolean;
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
}

const BookingForm = ({
  selectedDate,
  selectedTime,
  isSubmitting,
  onSubmit,
  onBack,
}: BookingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Format time for display
  const [h, m] = selectedTime.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const displayTime = `${displayH}:${String(m).padStart(2, "0")} ${period}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-6 md:p-8"
    >
      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          <span>{displayTime} CST</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Video className="w-4 h-4" />
          <span>Google Meet</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/60 text-xs uppercase tracking-wider">
            Name *
          </Label>
          <Input
            id="name"
            {...register("name")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wider">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white/60 text-xs uppercase tracking-wider">
            Company
          </Label>
          <Input
            id="company"
            {...register("company")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
            placeholder="Your company (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-white/60 text-xs uppercase tracking-wider">
            Notes
          </Label>
          <Textarea
            id="notes"
            {...register("notes")}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 min-h-[80px] resize-none"
            placeholder="Anything we should know? (optional)"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;
