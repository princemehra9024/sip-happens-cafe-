import { useEffect, useId, useState } from "react";
import { motion, useAnimationControls, useSpring, useTransform } from "framer-motion";
import { useFrame } from "@/engine/context";
import { Doodle, Fill, Stroke, appear, clamp, useAttr } from "./kit";

/**
 * The drinks tray from the menu.
 *  • `level` (0–1) pours the tall glass — the menu drives it as you hover drinks
 *  • hover the tray itself and it fills to the brim
 *  • click / tap and the glass clinks
 */

const GLASS_BOTTOM = 148;
const GLASS_DEPTH = 96;

export function DrinkTray({ className, level = 0.15 }: { className?: string; level?: number }) {
  const { active } = useFrame();
  const clipId = `glass-${useId().replace(/:/g, "")}`;
  const [hovered, setHovered] = useState(false);
  const clink = useAnimationControls();

  const target = active ? (hovered ? 1 : level) : 0;
  const pour = useSpring(0, { stiffness: 70, damping: 12 });
  useEffect(() => {
    pour.set(target);
  }, [pour, target]);

  const surfaceY = useTransform(pour, (v) => GLASS_BOTTOM - clamp(v, 0, 1.06) * GLASS_DEPTH);
  const liquid = useAttr<SVGRectElement, number>(surfaceY, "y");

  return (
    <Doodle
      viewBox="0 0 240 200"
      active={active}
      label="A hand-drawn tray with a coffee cup, a tall iced drink and a spoon. The glass fills as you browse the menu."
      className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => clink.start({ rotate: [0, -6, 5, -3, 0], transition: { duration: 0.6 } })}
      data-cursor="tap"
      style={{ cursor: "pointer" }}
    >
      <rect width="240" height="200" fill="transparent" stroke="none" />

      {/* tray */}
      <Stroke
        i={0}
        d="M20 150 C 18 124 68 107 122 107 C 178 107 222 124 220 151 C 218 177 172 193 119 193 C 66 193 22 176 20 150 Z"
      />
      <Stroke
        i={1}
        d="M36 150 C 35 131 78 118 121 118 C 166 118 205 131 204 151 C 203 169 164 182 120 182 C 76 182 37 169 36 150 Z"
      />

      {/* spoon */}
      <Stroke i={2} d="M106 174 C 126 170 154 164 178 159" />
      <Stroke i={2} fill="var(--paper)" d="M106 174 C 99 169 89 172 89 178 C 90 183 101 182 106 174 Z" />

      {/* little coffee cup */}
      <Stroke i={3} fill="var(--paper)" d="M60 96 L 63 146 C 66 157 97 157 100 146 L 102 96 Z" />
      <motion.ellipse variants={appear} custom={4} cx="81" cy="96" rx="21" ry="8" fill="var(--paper)" />
      <Fill i={5} d="M68 96 C 72 90 90 90 94 96 C 90 101 72 101 68 96 Z" />
      <g className="steam" style={{ animationDelay: "-0.4s" }}>
        <Stroke i={9} d="M74 80 C 70 74 78 70 74 63" />
      </g>
      <g className="steam" style={{ animationDelay: "-1.5s" }}>
        <Stroke i={9} d="M88 80 C 84 74 92 70 88 63" />
      </g>

      {/* tall glass */}
      <motion.g animate={clink} style={{ transformBox: "fill-box", originX: 0.5, originY: 1 }}>
        <Stroke i={6} fill="var(--paper)" d="M122 44 L 131 140 C 134 151 167 151 170 140 L 180 44" />
        <clipPath id={clipId}>
          <path d="M125 50 L 133 141 C 136 148 166 148 169 141 L 177 50 Z" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect ref={liquid} x="118" width="70" height="120" fill="currentColor" stroke="none" />
        </g>
        {/* ice */}
        <Stroke i={8} fill="var(--paper)" d="M138 143 L 137 119 C 137 109 148 109 148 119 L 148 144" />
        <Stroke i={8} fill="var(--paper)" d="M150 144 L 150 106 C 150 96 161 96 161 106 L 160 144" />
        <Stroke i={8} fill="var(--paper)" d="M162 142 L 163 123 C 163 115 172 115 171 123 L 169 141" />
        {/* rim + the little curl of the straw */}
        <motion.ellipse variants={appear} custom={7} cx="151" cy="44" rx="29" ry="8" />
        <Stroke i={7} d="M180 44 C 187 38 184 29 175 31" />
      </motion.g>
    </Doodle>
  );
}
