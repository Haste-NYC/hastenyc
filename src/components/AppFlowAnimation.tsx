import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AppFlowAnimationProps {
  size?: number;
  className?: string;
}

// The CONFORM app screens to cycle through
const screens = [
  { name: "select", label: "Select Project", image: "/app-screens/screen-select.png" },
  { name: "configure", label: "Configure Options", image: "/app-screens/screen-configure.png" },
  { name: "progress", label: "Converting", image: "/app-screens/screen-progress.png" },
  { name: "complete", label: "Complete", image: "/app-screens/screen-complete.png" },
];

const CYCLE_DURATION = 3000; // 3 seconds per screen

export const AppFlowAnimation = ({ size = 320, className = "" }: AppFlowAnimationProps) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  // Cycle through screens
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
    }, CYCLE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const currentScreen = screens[currentScreenIndex];
  const aspectRatio = 16 / 10;
  const height = size / aspectRatio;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: height }}
    >
      {/* Glow effect behind the app window */}
      <div
        className="absolute inset-0 rounded-xl opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.4) 0%, rgba(20, 184, 166, 0.2) 40%, transparent 70%)",
          filter: "blur(25px)",
          transform: "scale(1.3)",
        }}
      />

      {/* App window container */}
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(168, 85, 247, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image carousel with crossfade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentScreen.name}
            src={currentScreen.image}
            alt={currentScreen.label}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              // Hide image if not found
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </AnimatePresence>

        {/* Subtle overlay for polish */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </motion.div>

      {/* Screen indicator dots */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {screens.map((screen, index) => (
          <motion.button
            key={screen.name}
            onClick={() => setCurrentScreenIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentScreenIndex
                ? "bg-purple-400 scale-125"
                : "bg-white/30 hover:bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Current step label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen.label}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 text-[10px] uppercase tracking-wider whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
        >
          {currentScreen.label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AppFlowAnimation;
