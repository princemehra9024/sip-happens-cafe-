import { useMemo, useState, type ReactNode } from "react";
import { FrameContext, useEngine } from "@/engine/context";
import { cn } from "@/utils/cn";

interface Props {
  index: number;
  label: string;
  tone?: "light" | "dark";
  children: ReactNode;
}

/**
 * One full-screen page. The engine owns its inline styles (visibility,
 * transforms, clip-paths); React only decides what is inside and whether it
 * is reachable by keyboard / assistive tech.
 */
export function Frame({ index, label, tone = "light", children }: Props) {
  const engine = useEngine();
  const active = engine.index === index;
  const near = Math.abs(engine.index - index) <= 1;

  // Media starts loading once a frame has been within one step of the screen,
  // and then stays loaded.
  const [seen, setSeen] = useState(near);
  if (near && !seen) setSeen(true);

  const value = useMemo(() => ({ index, active, load: seen || near }), [index, active, seen, near]);

  return (
    <section
      ref={engine.refs[index]}
      data-frame={engine.ids[index]}
      aria-label={label}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "frame absolute inset-0 overflow-hidden",
        tone === "dark" ? "paper-brick tone-dark text-cream" : "paper text-maroon",
      )}
    >
      <FrameContext.Provider value={value}>
        <div data-frame-inner className="h-full w-full">
          {/* Only scrolls on screens too small to fit the frame — the engine
              lets this finish before it moves on. */}
          <div
            data-frame-scroll
            className="no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain"
          >
            {children}
          </div>
        </div>
      </FrameContext.Provider>
    </section>
  );
}
