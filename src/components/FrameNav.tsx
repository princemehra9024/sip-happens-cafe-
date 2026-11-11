import { motion } from "framer-motion";
import { FRAMES } from "@/data/content";
import { useEngine } from "@/engine/context";
import { cn } from "@/utils/cn";

const pad = (n: number) => String(n).padStart(2, "0");

/** The little flower that marks the current frame */
function Bud() {
  return (
    <svg viewBox="-10 -10 20 20" width="15" height="15" aria-hidden>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d="M0 -1 C -3.4 -4 -2.6 -9 0 -9.4 C 2.6 -9 3.4 -4 0 -1 Z" fill="currentColor" transform={`rotate(${a})`} />
      ))}
    </svg>
  );
}

/**
 * Frame index: dots down the right gutter (desktop) and a thin progress line
 * along the bottom edge (mobile). The bud glides between dots with a shared
 * layout animation.
 */
export function FrameNav() {
  const { index, count, dark, goTo } = useEngine();

  return (
    <>
      <nav
        aria-label="Frames"
        className={cn(
          "fixed right-0 top-1/2 z-30 hidden w-[var(--gutter)] -translate-y-1/2 flex-col transition-colors duration-500 md:flex",
          dark ? "text-cream" : "text-maroon",
        )}
      >
        {FRAMES.map((frame, i) => {
          const here = i === index;
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${pad(i + 1)} — ${frame.label}`}
              aria-current={here ? "true" : undefined}
              className="group relative grid h-[26px] w-full place-items-center"
            >
              <span
                className={cn(
                  "block h-[5px] w-[5px] rounded-full bg-current transition-opacity duration-300",
                  here ? "opacity-0" : "opacity-30 group-hover:opacity-90",
                )}
              />
              {here && (
                <motion.span
                  layoutId="frame-bud"
                  className={cn("absolute grid place-items-center", dark ? "text-[#EACB83]" : "text-[#526044]")}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <Bud />
                </motion.span>
              )}
              <span
                className={cn(
                  "t-tiny pointer-events-none absolute right-[calc(100%-4px)] whitespace-nowrap px-[5px] py-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                  dark ? "bg-[#E5DFD2] text-[#25272A]" : "bg-[#25272A] text-[#F0EDE4]",
                )}
              >
                {pad(i + 1)} {frame.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div aria-hidden className="fixed inset-x-0 bottom-0 z-30 h-[2px] md:hidden">
        <div
          className={cn("h-full origin-left transition-transform duration-700 ease-flora", dark ? "bg-[#EACB83]" : "bg-[#526044]")}
          style={{ transform: `scaleX(${(index + 1) / count})` }}
        />
      </div>
    </>
  );
}
