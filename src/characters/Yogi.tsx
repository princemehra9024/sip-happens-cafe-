import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFrame } from "@/engine/context";
import { Doodle, Fill, Stroke, appear, clamp, finePointer, useAttr } from "./kit";

/**
 * Downward dog, with a full cup of coffee balanced on top.
 *  • move the cursor left / right and she has to keep the cup level
 *  • click / tap and the cup hops
 */
export function Yogi({ className }: { className?: string }) {
  const { active } = useFrame();

  const lean = useMotionValue(0);
  const tilt = useSpring(lean, { stiffness: 110, damping: 5.5, mass: 0.9 });
  const hop = useSpring(0, { stiffness: 420, damping: 13 });

  const cupT = useTransform([tilt, hop], ([t, h]: number[]) => {
    return `translate(${(t * 0.4).toFixed(2)} ${(-h).toFixed(2)}) rotate(${t.toFixed(2)} 178 67)`;
  });
  const cup = useAttr<SVGGElement>(cupT);

  useEffect(() => {
    if (!active) {
      lean.set(0);
      return;
    }
    if (finePointer()) {
      const onMove = (e: PointerEvent) => {
        lean.set(clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1) * 14);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }
    // touch screens: she wobbles on her own
    const id = window.setInterval(() => lean.set((Math.random() - 0.5) * 22), 1900);
    return () => window.clearInterval(id);
  }, [active, lean]);

  const flip = () => {
    hop.set(30);
    window.setTimeout(() => hop.set(0), 170);
  };

  return (
    <Doodle
      viewBox="0 0 330 230"
      active={active}
      label="A hand-drawn figure in downward dog balancing a steaming cup of coffee on her back."
      className={className}
      onClick={flip}
      whileTap={{ scale: 0.97 }}
      data-cursor="tap"
      style={{ cursor: "pointer" }}
    >
      <rect width="330" height="230" fill="transparent" stroke="none" />

      {/* mat */}
      <Stroke i={0} d="M26 217 C 100 214 222 220 318 216" />

      <g className="breathe">
        {/* back: hand → shoulder → hips */}
        <Stroke i={1} d="M46 205 C 68 184 96 158 116 138 C 136 118 158 92 176 70" />
        {/* seat and back of the legs → heel */}
        <Stroke i={2} d="M176 70 C 187 63 199 69 205 80 L 300 197" />
        {/* foot */}
        <Stroke i={3} d="M300 197 C 311 201 309 210 298 210 L 272 210 C 265 210 263 204 268 200" />
        {/* front of the legs */}
        <Stroke i={3} d="M188 109 L 268 200" />
        <Stroke i={4} d="M199 93 L 287 199" />
        {/* belly */}
        <Stroke i={4} d="M128 151 C 148 139 170 121 188 109" />
        {/* inner arm + hand */}
        <Stroke i={5} d="M128 151 C 108 173 90 193 72 209" />
        <Stroke i={5} d="M46 205 C 37 207 36 212 45 212 L 72 209" />
        {/* hems: shirt, sleeve, shorts */}
        <Stroke i={6} d="M152 99 L 166 125" />
        <Stroke i={6} d="M100 155 L 113 168" />
        <Stroke i={6} d="M223 103 L 205 128" />
        {/* head hanging between the arms: face, then hair in a bun and braid */}
        <motion.circle variants={appear} custom={7} cx="103" cy="182" r="11.5" fill="var(--paper)" />
        <Stroke i={8} d="M107 180 C 109 182 111 182 113 180" />
        <Fill
          i={8}
          d="M99 168 C 86 165 74 176 76 190 C 78 201 93 204 102 196 C 96 190 94 179 99 168 Z"
        />
        <motion.circle variants={appear} custom={9} cx="71" cy="199" r="6.5" fill="currentColor" stroke="none" />
        <motion.circle variants={appear} custom={9} cx="62" cy="206" r="4.5" fill="currentColor" stroke="none" />

        {/* the cup she is trying not to spill */}
        <g ref={cup}>
          <Stroke i={9} fill="var(--paper)" d="M163 44 C 163 58 168 67 178 67 C 188 67 193 58 193 44 Z" />
          <motion.ellipse variants={appear} custom={10} cx="178" cy="44" rx="15" ry="4.6" fill="var(--paper)" />
          <motion.ellipse
            variants={appear}
            custom={10}
            cx="178"
            cy="44.5"
            rx="10.5"
            ry="2.6"
            fill="currentColor"
            stroke="none"
          />
          <Stroke i={10} d="M193 48 C 202 47 202 59 190 58" />
          <g className="steam">
            <Stroke i={11} d="M168 34 C 164 28 172 24 168 17" />
          </g>
          <g className="steam" style={{ animationDelay: "-0.9s" }}>
            <Stroke i={11} d="M178 32 C 174 25 182 20 178 12" />
          </g>
          <g className="steam" style={{ animationDelay: "-1.7s" }}>
            <Stroke i={11} d="M188 34 C 184 28 192 24 188 17" />
          </g>
        </g>
      </g>
    </Doodle>
  );
}
