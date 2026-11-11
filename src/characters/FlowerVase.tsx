import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useFrame } from "@/engine/context";
import { Doodle, Stroke, draw, finePointer, useAttr } from "./kit";

/**
 * The drooping flower from the home page.
 *  • its bloom leans towards the cursor on a springy stem
 *  • click / tap and it shakes open
 *  • hover the vase and it wobbles
 */

const VIEW = { w: 200, h: 220 };
const ROOT = { x: 88, y: 120 }; // where the stem leaves the vase
const REST = { x: 150, y: 90 }; // where the bloom hangs when left alone
const ANCHOR = { x: 104, y: 80 }; // centre of the bloom's reach
const REACH = 58;
const SPRING = { stiffness: 70, damping: 7, mass: 0.9 };

const PETALS = [
  { angle: -58, size: 0.86 },
  { angle: -29, size: 1 },
  { angle: 0, size: 1.07 },
  { angle: 29, size: 1 },
  { angle: 58, size: 0.86 },
];

function Petal({
  angle,
  size,
  order,
  bloom,
}: {
  angle: number;
  size: number;
  order: number;
  bloom: MotionValue<number>;
}) {
  const transform = useTransform(
    bloom,
    (v) => `rotate(${(angle * (1 + 0.5 * v)).toFixed(2)}) scale(${(size * (1 + 0.2 * v)).toFixed(3)})`,
  );
  const ref = useAttr<SVGGElement>(transform);
  return (
    <g ref={ref}>
      <Stroke i={4 + order} d="M0 0 C -6 8 -7 21 0 31 C 7 21 6 8 0 0 Z" fill="var(--paper)" />
    </g>
  );
}

export function FlowerVase({ className }: { className?: string }) {
  const { active } = useFrame();
  const svg = useRef<SVGSVGElement>(null);

  // target → sprung position of the bloom
  const tx = useMotionValue(REST.x);
  const ty = useMotionValue(REST.y);
  const hx = useSpring(tx, SPRING);
  const hy = useSpring(ty, SPRING);
  const bloom = useSpring(0, { stiffness: 260, damping: 9 });

  // the stem is re-drawn every frame as a curve from the vase to the bloom
  const stemD = useTransform([hx, hy], ([x, y]: number[]) => {
    const dx = x - ROOT.x;
    const c1 = `${(ROOT.x - 4 + dx * 0.08).toFixed(1)} ${ROOT.y - 92}`;
    const c2 = `${(x - dx * 0.14).toFixed(1)} ${(y - 58).toFixed(1)}`;
    return `M${ROOT.x} ${ROOT.y} C ${c1}, ${c2}, ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const headT = useTransform([hx, hy], ([x, y]: number[]) => {
    const lean = (Math.atan2(-(x - ROOT.x) * 0.14, 58) * 180) / Math.PI;
    return `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${lean.toFixed(1)})`;
  });
  const stem = useAttr<SVGPathElement>(stemD, "d");
  const head = useAttr<SVGGElement>(headT);

  useEffect(() => {
    if (!active || !finePointer()) return;

    const onMove = (e: PointerEvent) => {
      const r = svg.current?.getBoundingClientRect();
      if (!r || !r.width) return;
      // pointer in the drawing's own coordinates
      const px = ((e.clientX - r.left) / r.width) * VIEW.w;
      const py = ((e.clientY - r.top) / r.height) * VIEW.h;
      const vx = px - ANCHOR.x;
      const vy = py - ANCHOR.y;
      const dist = Math.hypot(vx, vy) || 1;
      const k = Math.min(1, REACH / dist);
      // far-away cursors only get a glance
      const attention = Math.max(0.35, Math.min(1, 1.25 - dist / 520));
      const gx = ANCHOR.x + vx * k;
      const gy = Math.min(ANCHOR.y + vy * k, 106);
      tx.set(REST.x + (gx - REST.x) * attention);
      ty.set(REST.y + (gy - REST.y) * attention);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      tx.set(REST.x);
      ty.set(REST.y);
    };
  }, [active, tx, ty]);

  const shakeOpen = () => {
    bloom.set(1);
    ty.set(ty.get() - 16);
    window.setTimeout(() => {
      bloom.set(0);
      if (!finePointer()) ty.set(REST.y);
    }, 380);
  };

  return (
    <Doodle
      svgRef={svg}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      active={active}
      label="A hand-drawn flower in a round vase. It leans towards your cursor."
      className={className}
      onClick={shakeOpen}
      data-cursor="tap"
      style={{ cursor: "pointer" }}
    >
      <rect width={VIEW.w} height={VIEW.h} fill="transparent" stroke="none" />

      <motion.path ref={stem} variants={draw} custom={2} />

      <g ref={head}>
        <g className="sway">
          {PETALS.map((p, i) => (
            <Petal key={i} angle={p.angle} size={p.size} order={i} bloom={bloom} />
          ))}
        </g>
      </g>

      <motion.g
        whileHover={{ rotate: [0, -4, 3, -2, 0] }}
        transition={{ duration: 0.7 }}
        style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}
      >
        <Stroke
          i={0}
          fill="var(--paper)"
          d="M76 124 C 58 128 44 144 46 164 C 47 184 60 198 78 196 C 85 201 96 201 103 196 C 121 197 133 182 132 162 C 131 144 119 129 101 124"
        />
        <Stroke i={1} fill="var(--paper)" d="M77 125 L 70 110 L 106 110 L 100 125" />
      </motion.g>
    </Doodle>
  );
}
