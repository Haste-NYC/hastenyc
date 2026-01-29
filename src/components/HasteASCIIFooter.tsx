import { useEffect, useRef, useCallback } from 'react';

// Characters ordered light to heavy by visual density
const CHARS_BY_DENSITY = '\u00b7.,:;-~"^`_=!?+*<>(){}[]|&%$#@\u2588';

const COLS = 120;
const ROWS = 45;
const CHAR_WIDTH = 7;
const CHAR_HEIGHT = 6.65;

export default function HasteASCIIFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  // Wave simulation buffers
  const waveHeight = useRef(new Float32Array(COLS * ROWS));
  const waveVelocity = useRef(new Float32Array(COLS * ROWS));
  const prevCursorCell = useRef({ x: -1, y: -1 });

  // Grid bitmap (1 = inside logo, 0 = empty)
  const gridRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));

  // Visibility + scale
  const isVisibleRef = useRef(false);
  const scaleRef = useRef(1);

  // Time tracked in rAF loop directly (no React state needed)
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  // Generate the logo bitmap once on mount
  useEffect(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = COLS;
    offscreen.height = ROWS;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.scale(COLS / 90, ROWS / 33);

    // h
    ctx.fillRect(0.844, 0, 7.56, 32);

    // a - curved stem
    ctx.beginPath();
    ctx.moveTo(14.39, 16.15);
    ctx.lineTo(14.39, 32);
    ctx.lineTo(21.89, 32);
    ctx.lineTo(21.89, 18.58);
    ctx.bezierCurveTo(21.89, 12.69, 17.44, 9.05, 10.67, 12.63);
    ctx.bezierCurveTo(10.67, 12.63, 14.39, 12.27, 14.39, 16.15);
    ctx.fill();

    // a - second curve
    ctx.beginPath();
    ctx.moveTo(34.2, 16.15);
    ctx.lineTo(34.2, 32);
    ctx.lineTo(41.71, 32);
    ctx.lineTo(41.71, 18.58);
    ctx.bezierCurveTo(41.71, 14.15, 37.56, 9.9, 30.06, 11.6);
    ctx.bezierCurveTo(30.06, 11.6, 34.2, 12.27, 34.2, 16.15);
    ctx.fill();

    // a - center dot
    ctx.beginPath();
    ctx.arc(27, 16.15, 3.72, 0, Math.PI * 2);
    ctx.fill();

    // a - tail flourish
    ctx.beginPath();
    ctx.moveTo(23.96, 31.51);
    ctx.bezierCurveTo(25.24, 32.85, 27.25, 32.91, 29.02, 32.55);
    ctx.bezierCurveTo(30.24, 32.3, 31.82, 31.82, 32.8, 30.97);
    ctx.bezierCurveTo(30.97, 31.33, 29.2, 30.18, 28.71, 28.42);
    ctx.bezierCurveTo(27.98, 25.69, 29.81, 22.53, 31.34, 21.25);
    ctx.bezierCurveTo(30.24, 21.25, 29.26, 21.31, 28.23, 21.62);
    ctx.bezierCurveTo(26.21, 22.28, 24.26, 23.5, 23.28, 25.38);
    ctx.bezierCurveTo(22.19, 27.26, 22.37, 29.88, 23.96, 31.51);
    ctx.fill();

    // s - main curve
    ctx.beginPath();
    ctx.moveTo(53.24, 28.36);
    ctx.bezierCurveTo(53.24, 30.06, 52.5, 31.64, 51.04, 32.73);
    ctx.bezierCurveTo(55.43, 32.73, 59.21, 29.39, 59.21, 25.93);
    ctx.bezierCurveTo(59.21, 22.08, 56.09, 20.71, 53.13, 19.41);
    ctx.bezierCurveTo(50.49, 18.24, 47.99, 17.14, 47.99, 14.39);
    ctx.bezierCurveTo(47.99, 13.18, 48.6, 12.27, 49.88, 11.29);
    ctx.bezierCurveTo(45.49, 11.29, 42.44, 14.63, 42.44, 17.49);
    ctx.bezierCurveTo(42.44, 21.03, 45.43, 22.34, 48.26, 23.59);
    ctx.bezierCurveTo(50.81, 24.71, 53.24, 25.77, 53.24, 28.36);
    ctx.fill();

    // s - top dot
    ctx.beginPath();
    ctx.arc(53.97, 14.45, 3.05, 0, Math.PI * 2);
    ctx.fill();

    // s - bottom dot
    ctx.beginPath();
    ctx.arc(45.91, 28.66, 3.72, 0, Math.PI * 2);
    ctx.fill();

    // t - vertical with curve
    ctx.beginPath();
    ctx.moveTo(59.72, 25.38);
    ctx.bezierCurveTo(59.72, 31.27, 64.11, 34.91, 70.94, 31.33);
    ctx.bezierCurveTo(70.94, 31.33, 67.22, 31.7, 67.22, 27.81);
    ctx.lineTo(67.22, 3.64);
    ctx.bezierCurveTo(66.31, 8.02, 63.07, 11.35, 59.72, 11.78);
    ctx.lineTo(59.72, 25.38);
    ctx.fill();

    // e - main body
    ctx.beginPath();
    ctx.moveTo(68.32, 21.98);
    ctx.bezierCurveTo(68.32, 27.93, 73.2, 32.73, 79.18, 32.73);
    ctx.bezierCurveTo(81.13, 32.79, 83.02, 32.24, 84.67, 31.27);
    ctx.bezierCurveTo(80.95, 32.12, 76.25, 30.3, 76.25, 26.17);
    ctx.lineTo(76.25, 21.01);
    ctx.lineTo(89.18, 21.01);
    ctx.bezierCurveTo(89.18, 18.4, 87.96, 11.23, 79.49, 11.23);
    ctx.bezierCurveTo(80.89, 11.42, 82.41, 12.69, 82.41, 16.09);
    ctx.lineTo(82.41, 20.44);
    ctx.lineTo(76.25, 20.44);
    ctx.lineTo(76.25, 14.45);
    ctx.bezierCurveTo(76.25, 12.69, 77.35, 11.48, 78.81, 11.23);
    ctx.bezierCurveTo(72.96, 11.42, 68.32, 16.15, 68.32, 21.98);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, COLS, ROWS);
    const grid = gridRef.current;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = (y * COLS + x) * 4;
        grid[y * COLS + x] = imageData.data[i + 3] > 20 ? 1 : 0;
      }
    }
  }, []);

  // Scale to fit container width
  useEffect(() => {
    const nativeWidth = COLS * CHAR_WIDTH;
    const updateScale = () => {
      if (wrapperRef.current) {
        const available = wrapperRef.current.clientWidth;
        scaleRef.current = available < nativeWidth ? available / nativeWidth : 1;
        if (canvasRef.current) {
          canvasRef.current.style.transform = `scale(${scaleRef.current})`;
        }
        wrapperRef.current.style.height = `${ROWS * CHAR_HEIGHT * scaleRef.current}px`;
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Pause animation when off-screen
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Main animation loop: wave simulation + canvas draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = '10px "SF Mono", "Monaco", "Consolas", monospace';
    ctx.textBaseline = 'top';

    let animationId: number;
    lastFrameRef.current = performance.now();

    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      timeRef.current += dt;

      const height = waveHeight.current;
      const vel = waveVelocity.current;
      const grid = gridRef.current;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const time = timeRef.current;

      const cx = Math.round(mx / CHAR_WIDTH);
      const cy = Math.round(my / CHAR_HEIGHT);
      const isOver = mx > -500;

      const speed = 0.12;
      const damping = 0.94;

      const prev = prevCursorCell.current;
      const cellMoved = isOver && (cx !== prev.x || cy !== prev.y);
      if (isOver) {
        prevCursorCell.current = { x: cx, y: cy };
      }

      // Wave equation simulation
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;

          if (cellMoved) {
            const gdx = x - cx;
            const gdy = y - cy;
            const gd = gdx * gdx + gdy * gdy;
            if (gd <= 9) {
              const strength = (1 - gd / 10) * 0.008;
              vel[i] += strength;
            }
          }

          let neighborSum = 0;
          let neighborCount = 0;
          if (x > 0) { neighborSum += height[i - 1]; neighborCount++; }
          if (x < COLS - 1) { neighborSum += height[i + 1]; neighborCount++; }
          if (y > 0) { neighborSum += height[i - COLS]; neighborCount++; }
          if (y < ROWS - 1) { neighborSum += height[i + COLS]; neighborCount++; }
          const neighborAvg = neighborCount > 0 ? neighborSum / neighborCount : 0;

          vel[i] += (neighborAvg - height[i]) * speed;
          vel[i] *= damping;
          height[i] += vel[i];
          height[i] = Math.max(-1, Math.min(1, height[i]));
        }
      }

      // Draw to canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxIdx = CHARS_BY_DENSITY.length - 1;
      const t = time * 0.4;

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (!grid[y * COLS + x]) continue;

          const nx = x * 0.04;
          const ny = y * 0.06;
          const swirl =
            Math.sin(nx * 2.3 + t * 0.7 + Math.sin(ny * 1.7 + t * 0.3) * 1.5) +
            Math.sin(ny * 3.1 - t * 0.5 + Math.cos(nx * 2.0 + t * 0.4) * 1.2) +
            Math.sin((nx + ny) * 1.8 + t * 0.9) * 0.7 +
            Math.sin(Math.sqrt(nx * nx + ny * ny) * 3.0 - t * 0.6) * 0.6;

          const breath = Math.sin(time + x * 0.015 + y * 0.02) * 0.03;
          const wave = height[y * COLS + x];

          const swirlNorm = (swirl + 3.3) / 6.6;
          const basePosition = 0.25 + swirlNorm * 0.35;
          const position = Math.min(1, Math.max(0, basePosition + Math.abs(wave) * 0.35));
          const charIndex = Math.round(position * maxIdx);
          const opacity = 0.5 + breath;

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillText(CHARS_BY_DENSITY[charIndex], x * CHAR_WIDTH, y * CHAR_HEIGHT);
        }
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = scaleRef.current;
    mousePosRef.current = {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = { x: -1000, y: -1000 };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: ROWS * CHAR_HEIGHT,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={COLS * CHAR_WIDTH}
        height={ROWS * CHAR_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'default',
          transformOrigin: 'top center',
        }}
      />
    </div>
  );
}
