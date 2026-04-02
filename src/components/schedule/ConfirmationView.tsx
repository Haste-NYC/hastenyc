import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, Video, User, ArrowRight, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { convertSlotToLocal, getUserTimezoneAbbr } from "@/lib/timezone";
import type { BookingConfirmation } from "@/hooks/useSchedule";

interface ConfirmationViewProps {
  confirmation: BookingConfirmation;
  bookedName: string;
  bookedDate: Date;
  bookedTime: string;
}

function generateICS(
  summary: string,
  startISO: string,
  endISO: string,
  meetLink: string | null
): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtStart = parseISO(startISO).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtEnd = parseISO(endISO).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Haste//Conform Studio//EN",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${summary}`,
    meetLink ? `LOCATION:${meetLink}` : "",
    meetLink ? `DESCRIPTION:Join via Google Meet: ${meetLink}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return lines;
}

const ConfirmationView = ({
  confirmation,
  bookedName,
  bookedDate,
  bookedTime,
}: ConfirmationViewProps) => {
  const handleDownloadICS = () => {
    const ics = generateICS(
      `Conform Studio | Demo - ${bookedName}`,
      confirmation.startTime,
      confirmation.endTime,
      confirmation.meetLink
    );
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conform-studio-demo.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format time for display in user's local timezone
  const dateStr = format(bookedDate, "yyyy-MM-dd");
  const displayTime = convertSlotToLocal(dateStr, bookedTime);
  const tzAbbr = getUserTimezoneAbbr();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto space-y-8"
    >
      {/* Success Icon */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-2">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Meeting Scheduled!</h2>
        <p className="text-white/50 text-sm">
          A calendar invite has been sent to your email with the Google Meet link.
        </p>
      </div>

      {/* Details Card */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-white/40" />
          <span className="text-white/60 text-sm">Date</span>
          <span className="ml-auto text-white font-medium text-sm">
            {format(bookedDate, "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-white/40" />
          <span className="text-white/60 text-sm">Time</span>
          <span className="ml-auto text-white font-medium text-sm">{displayTime} {tzAbbr} (30 min)</span>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-white/40" />
          <span className="text-white/60 text-sm">Host</span>
          <span className="ml-auto text-white font-medium text-sm">Jordan @ Haste</span>
        </div>
        {confirmation.meetLink && (
          <>
            <Separator className="bg-white/10" />
            <div className="flex items-center gap-3">
              <Video className="w-4 h-4 text-white/40" />
              <span className="text-white/60 text-sm">Meeting</span>
              <a
                href={confirmation.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors"
              >
                Join Google Meet
              </a>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleDownloadICS}
          variant="outline"
          className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 font-semibold py-5"
        >
          <Download className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>
        <Link to="/" className="block">
          <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold py-5">
            Back to Home
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ConfirmationView;
