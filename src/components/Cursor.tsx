import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEngine } from "@/engine/context";
import { cn } from "@/utils/cn";

type Mode = "idle" | "link" | "tap" | "drag";

const SIZE: Record<Mode, number> = { idle: 1, link: 2.2, tap: 3.1, drag: 3.6 };
const LABEL: Partial<Record<Mode, string>> = { tap: "tap", drag: "drag" };

/**
 * A small ring that trails the real cursor (mouse / trackpad only).
 * It swells over anything clickable and names the gesture over
 * `data-cursor="tap"` and `data-cursor="drag"` areas.
 */
export function Cursor() {
  const { dark } = useEngine();
  const [enabled] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const [mode, setMode] = useState<Mode>("idle");
  const [seen, setSeen] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 480, damping: 34, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 480, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
      const el = e.target instanceof Element ? e.target : null;
      const control = el?.closest("a, button, input, [role='button']");
      const zone = el?.closest<HTMLElement>("[data-cursor]");
      const next: Mode = control ? "link" : ((zone?.dataset.cursor as Mode | undefined) ?? "idle");
      setMode((prev) => (prev === next ? prev : next));
    };
    const onLeave = () => setSeen(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[70] transition-opacity duration-300",
        seen ? "opacity-100" : "opacity-0",
        dark ? "text-[#EACB83]" : "text-[#526044]",
      )}
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full border border-current"
        animate={{ scale: SIZE[mode], backgroundColor: mode === "link" ? "rgba(234,203,131,0.25)" : "rgba(234,203,131,0)" }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      />
      <motion.span
        className="t-tiny absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 text-[9px] tracking-[0.04em]"
        animate={{ opacity: LABEL[mode] ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {LABEL[mode] ?? ""}
      </motion.span>
    </motion.div>
  );
}
