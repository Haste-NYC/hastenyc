import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  // Skip Lenis entirely on mobile -- native scroll + CSS scroll-snap handles everything
  if (isMobile) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true,
          overscroll: false,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
};

export default SmoothScrollProvider;
