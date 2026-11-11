import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEngine, useFrame } from "@/engine/context";
import { cn } from "@/utils/cn";
import { Doodle, Fill, Stroke, appear, useAttr } from "./kit";

/**
 * "Back to top" — a figure folded forward with a coffee resting on her back.
 * Hover (or focus) and she unfolds, lifting the cup overhead; click and the
 * whole site goes back to the first frame.
 *
 * She is one articulated drawing: `fold` (1 = folded, 0 = standing) is a
 * spring, and the torso, hair, arm and cup are all posed from it.
 */

const LETTERS: { ch: string; x: number; y: number; italic?: boolean }[] = [
  { ch: "B", x: 13, y: 0, italic: true },
  { ch: "A", x: 10, y: 10, italic: true },
  { ch: "C", x: 7, y: 20, italic: true },
  { ch: "K", x: 4, y: 30, italic: true },
  { ch: "T", x: 90, y: 40 },
  { ch: "O", x: 90, y: 50 },
  { ch: "T", x: 2, y: 72 },
  { ch: "O", x: 2, y: 82 },
  { ch: "P", x: 2, y: 92 },
];

export function BackToTop({ className }: { className?: string }) {
  const { goTo } = useEngine();
  const { active } = useFrame();
  const [up, setUp] = useState(false);

  const fold = useSpring(1, { stiffness: 90, damping: 11 });
  useEffect(() => {
    fold.set(up ? 0 : 1);
  }, [fold, up]);

  const bodyT = useTransform(fold, (v) => `rotate(${(152 * v).toFixed(2)} 88 136)`);
  const hairT = useTransform(fold, (v) => `rotate(${(-225 * v).toFixed(2)} 88 62)`);
  const armT = useTransform(fold, (v) => `rotate(${(-14.5 * v).toFixed(2)} 91 86)`);
  const cupT = useTransform(fold, (v) => {
    const x = 128 + (86 - 128) * v;
    const y = 44 + (131 - 44) * v - Math.sin(Math.max(0, Math.min(1, v)) * Math.PI) * 16;
    return `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
  });
  const body = useAttr<SVGGElement>(bodyT);
  const hair = useAttr<SVGGElement>(hairT);
  const arm = useAttr<SVGGElement>(armT);
  const cup = useAttr<SVGGElement>(cupT);

  return (
    <button
      type="button"
      onClick={() => goTo(0)}
      onPointerEnter={() => setUp(true)}
      onPointerLeave={() => setUp(false)}
      onFocus={() => setUp(true)}
      onBlur={() => setUp(false)}
      aria-label="Back to top"
      className={cn("group relative block aspect-[150/205] text-cream", className)}
    >
      {LETTERS.map((l, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={cn("absolute font-serif text-[1.05rem] leading-none", l.italic && "italic")}
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
          animate={up ? { y: [0, -5, 0] } : { y: 0 }}
          transition={{ duration: 0.5, delay: up ? i * 0.045 : 0 }}
        >
          {l.ch}
        </motion.span>
      ))}

      <Doodle
        viewBox="30 2 116 242"
        active={active}
        label=""
        aria-hidden
        strokeWidth={2.5}
        className="absolute left-[22%] top-[5%] h-[95%] w-auto"
      >
        {/* legs + foot stay planted */}
        <Stroke i={0} d="M79 136 C 77 170 79 205 81 232" />
        <Stroke i={0} d="M97 136 C 97 170 93 205 91 232" />
        <Stroke i={1} d="M81 232 L 81 239 L 105 239 C 105 234 98 231 91 232" />

        {/* everything above the hips folds as one */}
        <g ref={body}>
          <Stroke i={2} d="M79 136 C 77 114 79 96 83 82" />
          <Stroke i={2} d="M97 136 C 99 116 99 98 96 84" />
          <Stroke i={3} d="M79 136 L 97 136" />
          <motion.circle variants={appear} custom={4} cx="92" cy="68" r="10" />
          <Stroke i={4} d="M102 66 L 105 69 L 102 71" />
          <g ref={hair}>
            <Fill i={5} d="M88 58 C 74 52 54 60 42 76 C 56 80 76 76 90 70 Z" />
          </g>
          <g ref={arm}>
            <Stroke i={6} d="M91 86 C 104 80 116 66 124 50" />
          </g>
        </g>

        {/* the cup travels from her back to her raised hand */}
        <g ref={cup}>
          <Stroke i={7} fill="var(--paper)" d="M-9 -14 C -9 -4 -5 3 0 3 C 5 3 9 -4 9 -14 Z" />
          <motion.ellipse variants={appear} custom={8} cx="0" cy="-14" rx="9" ry="3" fill="var(--paper)" />
          <Stroke i={8} d="M9 -11 C 15 -11 15 -3 8 -3" />
          <g className="steam">
            <Stroke i={9} d="M-4 -21 C -7 -25 -1 -28 -4 -33" />
          </g>
          <g className="steam" style={{ animationDelay: "-1.2s" }}>
            <Stroke i={9} d="M4 -21 C 1 -25 7 -28 4 -33" />
          </g>
        </g>
      </Doodle>
    </button>
  );
}
