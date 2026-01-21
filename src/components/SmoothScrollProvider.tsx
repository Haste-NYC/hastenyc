import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true,
          syncTouch: false,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
};

export default SmoothScrollProvider;
