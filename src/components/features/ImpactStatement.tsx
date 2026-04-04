import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const line1 = ["Manual", "online", "and", "conform", "work", "takes", "time."];
const line2 = ["It", "doesn't", "have", "to."];

export default function ImpactStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.3"],
  });

  const allWords = [...line1, ...line2];

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
          {line1.map((word, i) => (
            <ScrollWord
              key={i}
              text={word}
              dim={false}
              progress={scrollYProgress}
              start={i / allWords.length}
              end={(i + 1) / allWords.length}
            />
          ))}
        </span>
        <span className="flex flex-wrap gap-x-[0.28em]">
          {line2.map((word, j) => {
            const i = line1.length + j;
            return (
              <ScrollWord
                key={i}
                text={word}
                dim={true}
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
  const opacity = useTransform(progress, [start, end], [0.08, dim ? 0.4 : 1]);
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
