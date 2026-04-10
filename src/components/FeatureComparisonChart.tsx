import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  { name: "Multiple Video Tracks", edl: false, fcpxml: true, aaf: true, conform: true },
  { name: "Clip Markers", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Clip Label Colors", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Nested Sequences", edl: false, fcpxml: true, aaf: false, conform: true },
  { name: "Image Sequences", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Transitions", edl: false, fcpxml: true, aaf: false, conform: true },
  { name: "Audio/Video Effects", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Linear Speed Effects", edl: true, fcpxml: false, aaf: false, conform: true },
  { name: "Complex Speed Effects", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Time Interpolation Modes", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Text / Generators", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Multicam Clips", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Opacity / Blending Modes", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Crop Information", edl: false, fcpxml: false, aaf: false, conform: true },
  { name: "Bin Organization", edl: false, fcpxml: false, aaf: false, conform: true },
];

const Check = () => (
  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white">
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const XMark = () => (
  <span className="text-xs text-white/15">&times;</span>
);

// Per-cell animation: fade + scale for checks, fade for Xs
const CellMark = ({ value, rowIndex, colIndex }: { value: boolean; rowIndex: number; colIndex: number }) => {
  const isConform = colIndex === 3;
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: value && isConform ? 0.3 : 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: value && isConform ? 0.35 : 0.2,
        delay: rowIndex * 0.06 + colIndex * 0.08,
        ease: value && isConform ? [0.34, 1.56, 0.64, 1] : "easeOut",
      }}
    >
      {value ? <Check /> : <XMark />}
    </motion.div>
  );
};

export default function FeatureComparisonChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const gridCols = "grid-cols-[1fr_repeat(4,36px)] sm:grid-cols-[1fr_repeat(4,44px)] md:grid-cols-[1fr_repeat(4,100px)] lg:grid-cols-[1fr_repeat(4,120px)]";

  return (
    <div className="w-full px-2 sm:px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto origin-center scale-[0.88] sm:scale-100" ref={ref}>
        <div>
          <div>
            {/* Header row: title + column names */}
            <motion.div
              className={`grid ${gridCols} items-end pb-3 mb-1 border-b border-white/15 gap-1`}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-base md:text-2xl lg:text-3xl font-bold uppercase tracking-[0.04em] leading-[1.1] text-left">
                Feature<br />Comparison
              </h2>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">EDL</div>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">FCP<br />XML</div>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">AAF</div>
              <div className="text-[7px] md:text-[9px] font-semibold uppercase tracking-[0.08em] text-white text-center leading-[1.3]">Conform<br />Studio</div>
            </motion.div>

            {/* Feature Rows */}
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={`grid ${gridCols} items-center py-2.5 md:py-3 border-b border-white/[0.06] last:border-b-0 gap-1`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <motion.div
                  className="text-[11px] md:text-sm font-medium uppercase tracking-[0.06em] text-white/70 pr-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  {f.name}
                </motion.div>
                {isInView ? (
                  <>
                    <CellMark value={f.edl} rowIndex={i} colIndex={0} />
                    <CellMark value={f.fcpxml} rowIndex={i} colIndex={1} />
                    <CellMark value={f.aaf} rowIndex={i} colIndex={2} />
                    <CellMark value={f.conform} rowIndex={i} colIndex={3} />
                  </>
                ) : (
                  <>
                    <div /><div /><div /><div />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
