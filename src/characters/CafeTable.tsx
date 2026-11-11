import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFrame } from "@/engine/context";
import { Doodle, Fill, Stroke, appear, clamp, finePointer, useAttr } from "./kit";

/**
 * The café table for two.
 *  • the flower in the vase leans after your cursor
 *  • hover / tap a chair and it scoots back
 *  • tap a cup and it lets off steam
 */

const chairSpring = { type: "spring" as const, stiffness: 260, damping: 9 };

function Chair() {
  return (
    <motion.g
      whileHover={{ rotate: -8, x: -7 }}
      whileTap={{ rotate: -13, x: -10 }}
      transition={chairSpring}
      style={{ transformBox: "fill-box", originX: 0.5, originY: 1, cursor: "pointer" }}
    >
      <rect x="40" y="64" width="78" height="176" fill="transparent" stroke="none" />
      {/* back rest + slats */}
      <Stroke i={6} d="M62 156 C 50 126 44 96 50 78 C 54 68 66 70 70 82 C 76 104 80 130 84 152" />
      <Stroke i={7} d="M57 96 L 68 142" />
      <Stroke i={7} d="M63 90 L 74 140" />
      {/* seat */}
      <Stroke i={8} fill="var(--paper)" d="M60 158 C 64 148 104 146 112 156 C 108 168 66 170 60 158 Z" />
      {/* legs */}
      <Stroke i={9} d="M68 167 L 62 236" />
      <Stroke i={9} d="M104 164 L 112 234" />
      <Stroke i={9} d="M86 168 L 86 222" />
    </motion.g>
  );
}

function Cup({ onPuff, puff }: { onPuff: () => void; puff: number }) {
  return (
    <motion.g
      onTap={onPuff}
      onHoverStart={onPuff}
      whileTap={{ y: -8 }}
      whileHover={{ y: -3 }}
      transition={chairSpring}
      style={{ cursor: "pointer" }}
    >
      <rect x="84" y="60" width="54" height="64" fill="transparent" stroke="none" />
      <Stroke i={3} fill="var(--paper)" d="M97 106 C 100 122 132 122 135 106" />
      <motion.ellipse variants={appear} custom={4} cx="116" cy="104" rx="19" ry="12" fill="var(--paper)" />
      <motion.ellipse
        variants={appear}
        custom={5}
        cx="117"
        cy="103"
        rx="11.5"
        ry="7"
        fill="currentColor"
        stroke="none"
      />
      <Stroke i={4} d="M98 100 C 88 97 86 108 97 108" />
      {puff > 0 && (
        <motion.path
          key={puff}
          d="M118 84 C 110 78 126 73 118 64"
          initial={{ pathLength: 0, opacity: 0, y: 4 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0], y: -8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
    </motion.g>
  );
}

export function CafeTable({ className }: { className?: string }) {
  const { active } = useFrame();
  const [puffs, setPuffs] = useState<[number, number]>([0, 0]);

  const target = useMotionValue(0);
  const lean = useSpring(target, { stiffness: 80, damping: 6 });
  const flowerT = useTransform(lean, (v) => `rotate(${v.toFixed(2)} 160 68)`);
  const flower = useAttr<SVGGElement>(flowerT);

  useEffect(() => {
    if (!active) {
      target.set(0);
      return;
    }
    if (finePointer()) {
      const onMove = (e: PointerEvent) => {
        target.set(clamp((e.clientX / window.innerWidth - 0.3) * 2, -1, 1) * 18);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }
    const id = window.setInterval(() => target.set((Math.random() - 0.5) * 26), 2200);
    return () => window.clearInterval(id);
  }, [active, target]);

  // a first curl of steam once the table has drawn itself
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setPuffs(([a, b]) => [a, b + 1]), 2400);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <Doodle
      viewBox="0 0 320 270"
      active={active}
      label="A hand-drawn café table for two, with two coffees and a flower in a vase."
      className={className}
      data-cursor="tap"
    >
      {/* chairs sit behind the table */}
      <Chair />
      <g transform="translate(320 0) scale(-1 1)">
        <Chair />
      </g>

      {/* pedestal */}
      <Stroke i={1} d="M148 146 C 146 180 136 220 120 252" />
      <Stroke i={1} d="M172 146 C 174 180 184 220 200 252" />
      <Stroke i={2} d="M144 180 L 176 180" />

      {/* table top */}
      <Stroke
        i={0}
        fill="var(--paper)"
        d="M82 116 C 122 108 198 108 238 116 C 236 132 204 146 160 146 C 116 146 84 132 82 116 Z"
      />

      {/* flower */}
      <g ref={flower}>
        <Stroke i={11} d="M160 70 C 159 58 161 48 160 40" />
        <Stroke i={12} fill="var(--paper)" d="M160 40 C 148 40 142 28 150 22 C 158 18 162 30 160 40" />
        <Stroke i={12} fill="var(--paper)" d="M160 40 C 154 28 158 14 166 14 C 174 16 170 30 160 40" />
        <Stroke i={12} fill="var(--paper)" d="M160 40 C 166 30 180 26 182 34 C 182 42 170 44 160 40" />
      </g>
      {/* vase */}
      <Stroke
        i={10}
        fill="var(--paper)"
        d="M150 114 C 142 104 144 88 152 80 L 151 68 L 169 68 L 168 80 C 176 88 178 104 170 114 Z"
      />
      <Stroke i={11} d="M160 72 L 160 106" />
      <Fill i={11} d="M149 100 C 152 97 168 97 171 100 C 173 106 172 110 170 113 L 150 113 C 148 110 147 106 149 100 Z" opacity={0.18} />

      {/* cups */}
      <Cup puff={puffs[0]} onPuff={() => setPuffs(([a, b]) => [a + 1, b])} />
      {/* mirrored on a plain group so the cup's own motion can't undo the flip */}
      <g transform="translate(320 0) scale(-1 1)">
        <Cup puff={puffs[1]} onPuff={() => setPuffs(([a, b]) => [a, b + 1])} />
      </g>
    </Doodle>
  );
}
