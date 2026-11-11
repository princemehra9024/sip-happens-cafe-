import { useCallback, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

/**
 * Petals for Flora Fridays ("flower drop day"):
 *  • <AmbientPetals> — a slow, constant drift (pure CSS, GPU only)
 *  • usePetalBursts / <PetalBursts> — a handful thrown from wherever you click
 */

const TINTS = ["#F0EDE4", "#D8C8AC", "#526044", "#EACB83", "#C5B397"];

function PetalShape({ size, tint }: { size: number; tint: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="-10 -12 20 25" aria-hidden>
      <path d="M0 -11 C 7 -7 8 4 0 12 C -8 4 -7 -7 0 -11 Z" fill={tint} />
    </svg>
  );
}

const AMBIENT = [
  { left: 6, dur: 14, delay: -2, dx: "7vw", rot: "520deg", size: 15, tint: 0 },
  { left: 19, dur: 18, delay: -9, dx: "-4vw", rot: "-420deg", size: 19, tint: 1 },
  { left: 34, dur: 15, delay: -5, dx: "9vw", rot: "640deg", size: 13, tint: 2 },
  { left: 52, dur: 20, delay: -13, dx: "-6vw", rot: "-560deg", size: 17, tint: 3 },
  { left: 67, dur: 16, delay: -7, dx: "5vw", rot: "480deg", size: 14, tint: 0 },
  { left: 81, dur: 19, delay: -1, dx: "-8vw", rot: "-380deg", size: 18, tint: 1 },
  { left: 93, dur: 17, delay: -11, dx: "-3vw", rot: "600deg", size: 13, tint: 2 },
];

export function AmbientPetals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {AMBIENT.map((p, i) => (
        <span
          key={i}
          className="petal opacity-90"
          style={
            {
              left: `${p.left}%`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              "--dx": p.dx,
              "--rot": p.rot,
            } as CSSProperties
          }
        >
          <PetalShape size={p.size} tint={TINTS[p.tint]} />
        </span>
      ))}
    </div>
  );
}

interface Bit {
  dx: number;
  up: number;
  fall: number;
  rot: number;
  size: number;
  tint: string;
  dur: number;
}
export interface Burst {
  id: number;
  x: number;
  y: number;
  bits: Bit[];
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function usePetalBursts() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);

  const spawn = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    const bits: Bit[] = Array.from({ length: 10 }, () => ({
      dx: rand(-160, 160),
      up: rand(30, 120),
      fall: rand(200, 440),
      rot: rand(-540, 540),
      size: rand(12, 22),
      tint: TINTS[Math.floor(rand(0, TINTS.length))],
      dur: rand(1.5, 2.4),
    }));
    setBursts((list) => [...list.slice(-4), { id, x, y, bits }]);
    window.setTimeout(() => setBursts((list) => list.filter((b) => b.id !== id)), 2600);
  }, []);

  return { bursts, spawn };
}

export function PetalBursts({ bursts }: { bursts: Burst[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bursts.map((b) =>
        b.bits.map((p, i) => (
          <motion.span
            key={`${b.id}-${i}`}
            className="absolute"
            style={{ left: b.x, top: b.y }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: [0, p.dx * 0.45, p.dx],
              y: [0, -p.up, p.fall],
              scale: [0, 1, 1],
              rotate: [0, p.rot * 0.3, p.rot],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: p.dur, ease: "easeOut", times: [0, 0.25, 1] }}
          >
            <PetalShape size={p.size} tint={p.tint} />
          </motion.span>
        )),
      )}
    </div>
  );
}
