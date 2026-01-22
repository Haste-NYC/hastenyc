import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AppFlowAnimationProps {
  size?: number;
  className?: string;
}

// The CONFORM app screens to cycle through
const screens = [
  { name: "dashboard", label: "Select Project", duration: 2500 },
  { name: "project-selected", label: "Configure Options", duration: 3000 },
  { name: "in-progress", label: "Converting", duration: 4000 },
  { name: "complete", label: "Complete", duration: 3000 },
];

const BASE_URL = "http://localhost:5180";

export const AppFlowAnimation = ({ size = 320, className = "" }: AppFlowAnimationProps) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [loadedScreens, setLoadedScreens] = useState<Set<string>>(new Set());
  const [allLoaded, setAllLoaded] = useState(false);

  // Track when each iframe loads
  const handleIframeLoad = (screenName: string) => {
    setLoadedScreens(prev => {
      const newSet = new Set(prev);
      newSet.add(screenName);
      return newSet;
    });
  };

  // Check if all screens are loaded
  useEffect(() => {
    if (loadedScreens.size === screens.length) {
      setAllLoaded(true);
    }
  }, [loadedScreens]);

  // Cycle through screens only after all are loaded
  useEffect(() => {
    if (!allLoaded) return;

    const screen = screens[currentScreenIndex];
    const timer = setTimeout(() => {
      setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
    }, screen.duration);

    return () => clearTimeout(timer);
  }, [currentScreenIndex, allLoaded]);

  const currentScreen = screens[currentScreenIndex];
  const aspectRatio = 800 / 600; // Approximate app aspect ratio
  const height = size / aspectRatio;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: height }}
    >
      {/* Glow effect behind the app window */}
      <div
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, rgba(20, 184, 166, 0.2) 40%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.2)",
        }}
      />

      {/* App window container */}
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.2)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* All iframes preloaded, only current one visible */}
        {screens.map((screen, index) => (
          <div
            key={screen.name}
            className="absolute inset-0"
            style={{
              opacity: index === currentScreenIndex ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <iframe
              src={`${BASE_URL}/${screen.name}`}
              className="w-full h-full border-0"
              style={{
                transform: "scale(0.55)",
                transformOrigin: "top left",
                width: `${100 / 0.55}%`,
                height: `${100 / 0.55}%`,
                pointerEvents: "none",
              }}
              onLoad={() => handleIframeLoad(screen.name)}
              title={`Conform Studio - ${screen.label}`}
            />
          </div>
        ))}

        {/* Loading indicator while iframes load */}
        {!allLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white/50 text-xs uppercase tracking-wider">
              Loading...
            </div>
          </div>
        )}

        {/* Overlay to prevent interaction */}
        <div className="absolute inset-0 pointer-events-none" />
      </motion.div>

      {/* Screen indicator dots */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {screens.map((screen, index) => (
          <motion.div
            key={screen.name}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentScreenIndex
                ? "bg-purple-400"
                : "bg-white/30"
            }`}
            animate={index === currentScreenIndex ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Current step label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen.label}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-wider whitespace-nowrap"
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
