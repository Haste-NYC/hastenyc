import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatisticHighlightProps {
  value: string;
  suffix?: string;
  citation?: string;
  useGradient?: boolean;
  className?: string;
}

const StatisticHighlight = ({
  value,
  suffix,
  citation,
  useGradient = true,
  className = "",
}: StatisticHighlightProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(value);

  // Animated counter effect for numeric values
  useEffect(() => {
    if (!isInView) return;

    // Check if value contains a number
    const numericMatch = value.match(/(\d+)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1], 10);
    const prefix = value.slice(0, numericMatch.index);
    const suffix = value.slice((numericMatch.index || 0) + numericMatch[1].length);

    let startTime: number;
    const duration = 1500; // ms

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * targetNumber);

      setDisplayValue(`${prefix}${currentValue}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className={`space-y-1 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main statistic value */}
      <span
        className={`block text-6xl md:text-8xl font-bold tracking-tight ${
          useGradient
            ? "text-foreground"
            : "text-foreground"
        }`}
      >
        {displayValue}
      </span>

      {/* Suffix text */}
      {suffix && (
        <span className="block text-2xl md:text-3xl font-medium text-foreground/80 uppercase tracking-wider">
          {suffix}
        </span>
      )}

      {/* Citation text - Frame.io style */}
      {citation && (
        <span className="block mt-2 citation-text">
          {citation}
        </span>
      )}
    </motion.div>
  );
};

export default StatisticHighlight;
