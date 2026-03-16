import React, { useEffect, useRef, useCallback } from 'react';

interface LoadingAnimationProps {
  /** URL to the sprite sheet image */
  spriteSheet: string;
  /** URL to static image for mobile (optional - will extract first frame if not provided) */
  staticImage?: string;
  /** Number of frames in the animation */
  frameCount?: number;
  /** Frames per second */
  fps?: number;
  /** Width of each frame in the sprite sheet */
  frameWidth?: number;
  /** Height of each frame in the sprite sheet */
  frameHeight?: number;
  /** Number of columns in the sprite sheet */
  columns?: number;
  /** Display size (canvas will scale to this) */
  size?: number;
  /** Whether the animation should loop */
  loop?: boolean;
  /** Whether the animation is playing */
  playing?: boolean;
  /** Optional className for the canvas */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  spriteSheet,
  staticImage,
  frameCount = 298,
  fps = 60,
  frameWidth = 604,
  frameHeight = 604,
  columns = 10,
  size = 200,
  loop = true,
  playing = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);
  const animationRef = useRef<number>(0);
  const lastFrameTimeRef = useRef(0);
  const dprRef = useRef(1);
  // Synchronous check so the first render already knows — avoids fetching
  // the 28 MB sprite sheet before a useEffect can flip the flag.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Setup canvas for high-DPI displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    // Scale canvas for retina displays
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Scale context to match DPR
      ctx.scale(dpr, dpr);
      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
  }, [size]);

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, frameIndex: number) => {
    if (!imageRef.current) return;

    const col = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);
    const sx = col * frameWidth;
    const sy = row * frameHeight;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(
      imageRef.current,
      sx, sy, frameWidth, frameHeight,
      0, 0, size, size
    );
  }, [columns, frameWidth, frameHeight, size]);

  const animate = useCallback((timestamp: number) => {
    if (!playing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !imageRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const frameDuration = 1000 / fps;
    const elapsed = timestamp - lastFrameTimeRef.current;

    if (elapsed >= frameDuration) {
      drawFrame(ctx, frameRef.current);

      frameRef.current++;
      if (frameRef.current >= frameCount) {
        if (loop) {
          frameRef.current = 0;
        } else {
          return;
        }
      }

      lastFrameTimeRef.current = timestamp - (elapsed % frameDuration);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [fps, frameCount, loop, playing, drawFrame]);

  useEffect(() => {
    // Skip loading the sprite sheet entirely on mobile
    if (isMobile) return;

    const img = new Image();
    img.src = spriteSheet;
    img.onload = () => {
      imageRef.current = img;
      frameRef.current = 0;
      lastFrameTimeRef.current = 0;

      if (playing) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spriteSheet, playing, animate, isMobile]);

  useEffect(() => {
    if (playing && imageRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (!playing && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playing, animate]);

  // On mobile, skip the heavy sprite animation entirely for performance
  // The animation is decorative and the hero section works without it
  if (isMobile) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    />
  );
};

export default LoadingAnimation;
