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
  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-400">
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const XMark = () => (
  <span className="text-xs text-white/15">&times;</span>
);

export default function FeatureComparisonChart() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[480px] md:max-w-3xl mx-auto">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="min-w-[320px]">
            {/* Header row: title + column names */}
            <div className="grid grid-cols-[1fr_repeat(4,36px)] sm:grid-cols-[1fr_repeat(4,44px)] md:grid-cols-[1fr_repeat(4,80px)] lg:grid-cols-[1fr_repeat(4,100px)] items-end pb-3 mb-1 border-b border-white/15 gap-1">
              <h2 className="text-base md:text-2xl lg:text-3xl font-bold uppercase tracking-[0.04em] leading-[1.1] text-left">
                Feature<br />Comparison
              </h2>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">EDL</div>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">FCP<br />XML</div>
              <div className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40 text-center leading-[1.2]">AAF</div>
              <div className="text-[7px] md:text-[9px] font-semibold uppercase tracking-[0.08em] text-green-400 text-center leading-[1.3]">Conform<br />Studio</div>
            </div>

            {/* Feature Rows */}
            {features.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_repeat(4,36px)] sm:grid-cols-[1fr_repeat(4,44px)] md:grid-cols-[1fr_repeat(4,80px)] lg:grid-cols-[1fr_repeat(4,100px)] items-center py-2.5 md:py-3 border-b border-white/[0.06] last:border-b-0 gap-1"
              >
                <div className="text-[11px] md:text-sm font-medium uppercase tracking-[0.06em] text-white/70 pr-2">
                  {f.name}
                </div>
                <div className="flex items-center justify-center">{f.edl ? <Check /> : <XMark />}</div>
                <div className="flex items-center justify-center">{f.fcpxml ? <Check /> : <XMark />}</div>
                <div className="flex items-center justify-center">{f.aaf ? <Check /> : <XMark />}</div>
                <div className="flex items-center justify-center">{f.conform ? <Check /> : <XMark />}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
