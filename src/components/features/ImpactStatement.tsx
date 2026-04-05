import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const line1 = ["Stop", "rebuilding", "timelines.", "Start", "finishing."];
const line2 = ["Let", "us", "handle", "the", "hard", "work", "for", "you.", "Project", "migration", "done", "in", "minutes,", "not", "days."];

const allWords = [...line1, ...line2];
const inMinutesStart = allWords.length - 7;

// Mobile top: "Stop rebuilding timelines. Start finishing. Let us handle the hard work for you."
const topWords = [...line1, ...line2.slice(0, 8)];

// Mobile bottom: "Project migration done in minutes, not days."
const bottomWords = line2.slice(8);

function MobileWord({ word, dim, index }: { word: string; dim: boolean; index: number }) {
  return (
    <motion.span
      className={dim ? "text-foreground/40" : ""}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: dim ? 0.4 : 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      style={{ display: "inline-block" }}
    >
      {word}
    </motion.span>
  );
}

export function ImpactStatementMobileTop() {
  return (
    <div className="px-4 pt-4 pb-2 text-left">
      <h2
        className="font-black tracking-tight leading-[1.05] uppercase flex flex-wrap gap-x-[0.22em]"
        style={{ fontSize: "clamp(22px, 6vw, 36px)", letterSpacing: "-0.03em" }}
      >
        {topWords.map((word, i) => (
          <MobileWord
            key={i}
            word={word}
            dim={i >= line1.length}
            index={i}
          />
        ))}
      </h2>
    </div>
  );
}

export function ImpactStatementMobileBottom() {
  return (
    <div className="px-4 pt-3 pb-2 text-left">
      <p
        className="font-black tracking-tight leading-[1.05] uppercase flex flex-wrap gap-x-[0.22em]"
        style={{ fontSize: "clamp(22px, 6vw, 36px)", letterSpacing: "-0.03em" }}
      >
        {bottomWords.map((word, i) => (
          <MobileWord
            key={i}
            word={word}
            dim={false}
            index={i}
          />
        ))}
      </p>
    </div>
  );
}

// Desktop: scroll-driven reveal (default export)
export default function ImpactStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "start 0.15"],
  });

  // Mobile uses the split components above, not this
  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-24 md:py-36 text-left"
    >
      <h2
        className="font-black tracking-tight leading-[1.05] uppercase"
        style={{ fontSize: "clamp(28px, 6vw, 64px)", letterSpacing: "-0.03em" }}
      >
        <span className="flex flex-wrap gap-x-[0.28em]">
          {allWords.map((word, i) => {
            const dim = i >= line1.length && i < inMinutesStart;
            return (
              <ScrollWord
                key={i}
                text={word}
                dim={dim}
                progress={scrollYProgress}
                start={i / allWords.length}
                end={(i + 1) / allWords.length}
              />
            );
          })}
        </span>
      </h2>
    </div>
  );
}

function ScrollWord({
  text,
  dim,
  progress,
  start,
  end,
}: {
  text: string;
  dim: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0, dim ? 0.4 : 1]);
  const y = useTransform(progress, [start, end], [8, 0]);

  return (
    <motion.span
      className={dim ? "text-foreground/40" : ""}
      style={{ opacity, y, display: "inline-block" }}
    >
      {text}
    </motion.span>
  );
}
