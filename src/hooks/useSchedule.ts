import { useState } from 'react';
import { toast } from 'sonner';

export interface DayAvailability {
  date: string;
  dayLabel: string;
  slots: string[];
}

export interface AvailabilityResponse {
  days: DayAvailability[];
}

export interface BookingData {
  date: string;
  time: string;
  name: string;
  email: string;
  company?: string;
  notes?: string;
}

export interface BookingConfirmation {
  success: boolean;
  eventId: string;
  meetLink: string | null;
  startTime: string;
  endTime: string;
}

// In dev, use empty string so requests go through Vite's proxy (/api/...)
// In production, use the configured API URL
const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : '';

export function useSchedule() {
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = async (startDate: string, endDate: string): Promise<AvailabilityResponse | null> => {
    setIsLoadingAvailability(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/api/schedule/availability?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch availability');
      }

      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load availability';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const bookAppointment = async (data: BookingData): Promise<BookingConfirmation | null> => {
    setIsBooking(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/schedule/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || 'Failed to book appointment');
      }

      return await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Booking failed';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsBooking(false);
    }
  };

  return { isLoadingAvailability, isBooking, error, fetchAvailability, bookAppointment };
}
