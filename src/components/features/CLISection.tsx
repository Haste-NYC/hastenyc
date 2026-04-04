import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

interface TerminalLine {
  text: string;
  type: "comment" | "command" | "flag" | "output" | "success" | "info" | "blank";
  delay?: number;
}

const sequences: TerminalLine[][] = [
  [
    { text: "# Batch convert entire series", type: "comment" },
    { text: "$ conform-studio \\", type: "command" },
    { text: "    --project /projects/EP01_Main.prproj \\", type: "flag" },
    { text: "    --sequences \"EP01_V6_FINAL,EP01_V6_VFX\" \\", type: "flag" },
    { text: "    --output /resolve/imports/ \\", type: "flag" },
    { text: "    --media-search-paths /nas/media/ \\", type: "flag" },
    { text: "    --resolve \\", type: "flag" },
    { text: "    --verify-conform \\", type: "flag" },
    { text: "    --verification-report /reports/ep01.json", type: "flag" },
    { text: "", type: "blank", delay: 400 },
    { text: "[INFO]  Loading Premiere project...", type: "info", delay: 300 },
    { text: "[INFO]  Found 2 sequences, 847 clips", type: "info", delay: 600 },
    { text: "[INFO]  Resolving media paths... 847/847 linked", type: "info", delay: 800 },
    { text: "[INFO]  Converting EP01_V6_FINAL (V1-V12, A1-A24)", type: "info", delay: 400 },
    { text: "[INFO]  Transferring timecodes, markers, audio levels", type: "info", delay: 500 },
    { text: "[INFO]  Flattening multicam clips... 23 flattened", type: "info", delay: 400 },
    { text: "[INFO]  Converting EP01_V6_VFX (V1-V8, A1-A16)", type: "info", delay: 600 },
    { text: "[INFO]  Importing into DaVinci Resolve...", type: "info", delay: 700 },
    { text: "[OK]    Verification: 847/847 clips passed", type: "success", delay: 500 },
    { text: "[OK]    Report saved to /reports/ep01.json", type: "success", delay: 200 },
    { text: "[OK]    Completed in 14.2s", type: "success", delay: 300 },
  ],
  [
    { text: "# Real-time NDI quality control", type: "comment" },
    { text: "$ conform-studio validate-bezier \\", type: "command" },
    { text: "    --premiere-ndi \"PREMIERE_OUT\" \\", type: "flag" },
    { text: "    --resolve-ndi \"RESOLVE_OUT\" \\", type: "flag" },
    { text: "    --ssim-threshold 0.98 \\", type: "flag" },
    { text: "    --auto-correct \\", type: "flag" },
    { text: "    --save-diffs", type: "flag" },
    { text: "", type: "blank", delay: 400 },
    { text: "[INFO]  Connecting to NDI sources...", type: "info", delay: 500 },
    { text: "[INFO]  PREMIERE_OUT: 1920x1080 @ 23.976fps", type: "info", delay: 400 },
    { text: "[INFO]  RESOLVE_OUT: 1920x1080 @ 23.976fps", type: "info", delay: 300 },
    { text: "[INFO]  Comparing frame 00:01:14:08  SSIM: 0.997", type: "info", delay: 600 },
    { text: "[INFO]  Comparing frame 00:04:22:15  SSIM: 0.994", type: "info", delay: 400 },
    { text: "[WARN]  Frame 00:07:41:03  SSIM: 0.962 < 0.98", type: "output", delay: 500 },
    { text: "[INFO]  Auto-correcting bezier keyframes...", type: "info", delay: 600 },
    { text: "[INFO]  Re-comparing frame 00:07:41:03  SSIM: 0.996", type: "info", delay: 500 },
    { text: "[OK]    All frames passed (correction applied: 1)", type: "success", delay: 400 },
    { text: "[OK]    Diff images saved to /output/diffs/", type: "success", delay: 200 },
  ],
  [
    { text: "# Multi-format ingest into Resolve", type: "comment" },
    { text: "$ conform-studio \\", type: "command" },
    { text: "    --aaf /avid/EP02_Main.aaf \\", type: "flag" },
    { text: "    --edl /edl/EP02_conform.edl \\", type: "flag" },
    { text: "    --frame-rate 23.976 \\", type: "flag" },
    { text: "    --resolve \\", type: "flag" },
    { text: "    --remove-disabled-tracks \\", type: "flag" },
    { text: "    --remove-offline-clips \\", type: "flag" },
    { text: "    --verify-audio-gain \\", type: "flag" },
    { text: "    --audio-verify-tolerance-db 1.5", type: "flag" },
    { text: "", type: "blank", delay: 400 },
    { text: "[INFO]  Parsing AAF: EP02_Main.aaf", type: "info", delay: 400 },
    { text: "[INFO]  Found 1,204 clips across 18 tracks", type: "info", delay: 500 },
    { text: "[INFO]  Parsing EDL: EP02_conform.edl (23.976fps)", type: "info", delay: 400 },
    { text: "[INFO]  Removing 4 disabled tracks, 12 offline clips", type: "info", delay: 500 },
    { text: "[INFO]  Verifying audio gain... A1-A16", type: "info", delay: 700 },
    { text: "[INFO]  Audio RMS delta: 0.3dB avg (tolerance: 1.5dB)", type: "info", delay: 400 },
    { text: "[INFO]  Importing into DaVinci Resolve...", type: "info", delay: 600 },
    { text: "[OK]    1,192 clips imported, 0 errors", type: "success", delay: 400 },
    { text: "[OK]    Audio gain verified: all tracks within tolerance", type: "success", delay: 200 },
    { text: "[OK]    Completed in 8.7s", type: "success", delay: 300 },
  ],
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const colorFor = (type: TerminalLine["type"]) => {
  switch (type) {
    case "comment": return "text-white/20";
    case "command": return "text-white/80";
    case "flag": return "text-white/40";
    case "output": return "text-amber-400/70";
    case "success": return "text-emerald-400/80";
    case "info": return "text-white/35";
    case "blank": return "";
  }
};

function AnimatedTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [completedLines, setCompletedLines] = useState<TerminalLine[]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const cancelRef = useRef(false);
  const runningRef = useRef(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [completedLines, activeLine]);

  const runSequence = useCallback(async (seq: TerminalLine[]) => {
    if (runningRef.current) return;
    runningRef.current = true;
    cancelRef.current = false;
    setCompletedLines([]);
    setActiveLine("");

    for (const line of seq) {
      if (cancelRef.current) break;

      const preDelay = line.delay ?? 0;
      if (preDelay > 0) await wait(preDelay);
      if (cancelRef.current) break;

      if (line.type === "command" || line.type === "flag") {
        setActiveColor(colorFor(line.type));
        for (let c = 1; c <= line.text.length; c++) {
          if (cancelRef.current) break;
          setActiveLine(line.text.slice(0, c));
          await wait(16);
        }
        if (cancelRef.current) break;
        setActiveLine("");
        setCompletedLines((prev) => [...prev, line]);
        await wait(40);
      } else {
        setCompletedLines((prev) => [...prev, line]);
        if (line.type === "info" || line.type === "success" || line.type === "output") {
          await wait(120);
        }
      }
    }

    if (!cancelRef.current) await wait(4000);
    runningRef.current = false;
    if (!cancelRef.current) {
      setSequenceIndex((prev) => (prev + 1) % sequences.length);
    }
  }, []);

  useEffect(() => {
    if (isInView) {
      runSequence(sequences[sequenceIndex]);
    } else {
      cancelRef.current = true;
      runningRef.current = false;
      setCompletedLines([]);
      setActiveLine("");
    }
  }, [isInView, sequenceIndex, runSequence]);

  return (
    <div ref={ref} className="bg-[#0a0a0f] border border-white/[0.08] rounded-lg overflow-hidden">
      <div
        ref={terminalBodyRef}
        className="p-4 font-mono text-[11px] leading-[1.7] h-[320px] overflow-y-auto
          [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {completedLines.map((line, i) => (
          <div key={i} className={`${colorFor(line.type)} ${line.type === "blank" ? "h-3" : ""}`}>
            {line.type !== "blank" && line.text}
          </div>
        ))}
        {activeLine && (
          <div className={activeColor}>
            {activeLine}
            <span className={`inline-block w-[7px] h-[14px] bg-white/60 ml-0.5 align-middle ${cursorVisible ? "opacity-100" : "opacity-0"}`} />
          </div>
        )}
        {!activeLine && (
          <span className={`inline-block w-[7px] h-[14px] bg-white/60 ml-0.5 align-middle ${cursorVisible ? "opacity-100" : "opacity-0"}`} />
        )}
      </div>
    </div>
  );
}

export default function CLISection() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="inline-block mb-4 text-[10px] uppercase tracking-[0.15em] text-white/50 border border-white/15 px-2.5 py-1 rounded">
            Enterprise
          </span>
          <h2
            className="font-black uppercase tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.02em" }}
          >
            Full CLI
            <br />
            for Pipelines
          </h2>
          <p className="mt-4 text-sm md:text-[15px] text-foreground/50 leading-relaxed max-w-md">
            40+ command-line flags for headless conversion, batch ingest, QC automation, and verification reporting. Integrates into facility pipelines, render farms, and CI/CD systems without a GUI.
          </p>
          <span className="inline-block mt-5 text-[11px] uppercase tracking-[0.1em] text-white/60 border border-white/15 px-2.5 py-1 rounded">
            2-10+ hours saved per batch
          </span>
        </div>

        <AnimatedTerminal />
      </motion.div>
    </div>
  );
}
