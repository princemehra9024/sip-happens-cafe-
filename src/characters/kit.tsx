import { useLayoutEffect, useRef, type ReactNode, type Ref } from "react";
import { motion, type MotionValue, type SVGMotionProps, type Variants } from "framer-motion";

/**
 * Shared toolkit for the hand-drawn characters.
 *
 * Each character is a small inline SVG (a few hundred bytes of path data)
 * that draws itself when its frame arrives, then reacts to the pointer.
 */

/* ---- variants: lines draw on, filled shapes fade in ---- */

const START = 0.75;
const STEP = 0.09;

export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0.25 } },
  show: (i: number = 0) => {
    const delay = START + i * STEP;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration: 0.8, ease: "easeInOut" },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

export const appear: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: START + i * STEP, duration: 0.5 },
  }),
};

type PathProps = Omit<SVGMotionProps<SVGPathElement>, "ref"> & { i?: number };

/** An outline that draws itself. `i` sets its place in the drawing order. */
export function Stroke({ i = 0, ...props }: PathProps) {
  return <motion.path variants={draw} custom={i} {...props} />;
}

/** A solid scribbled shape (hair, coffee, …) */
export function Fill({ i = 0, ...props }: PathProps) {
  return <motion.path variants={appear} custom={i} fill="currentColor" stroke="none" {...props} />;
}

/* ---- the SVG shell every character shares ---- */

interface DoodleProps extends Omit<SVGMotionProps<SVGSVGElement>, "ref" | "children"> {
  active: boolean;
  label: string;
  svgRef?: Ref<SVGSVGElement>;
  children: ReactNode;
}

export function Doodle({ active, label, svgRef, children, ...rest }: DoodleProps) {
  return (
    <motion.svg
      ref={svgRef}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      role="img"
      aria-label={label}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      {...rest}
    >
      <g filter="url(#crayon)">{children}</g>
    </motion.svg>
  );
}

/* ---- helpers ---- */

/**
 * Drive a raw SVG attribute from a motion value. Springs do the physics;
 * writing the attribute directly keeps rotation pivots exact.
 */
export function useAttr<T extends SVGElement, V extends string | number = string>(
  value: MotionValue<V>,
  name = "transform",
) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const apply = (v: V) => ref.current?.setAttribute(name, String(v));
    apply(value.get());
    return value.on("change", apply);
  }, [value, name]);
  return ref;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** True on devices with a real hovering pointer (mouse / trackpad) */
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
