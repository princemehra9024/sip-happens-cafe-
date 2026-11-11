import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { finePointer } from "@/characters/kit";
import { AmbientPetals, PetalBursts, usePetalBursts } from "@/characters/Petals";
import { Img } from "@/components/Img";
import { SplitWords } from "@/components/SplitWords";
import { FRIDAYS } from "@/data/content";
import { useFrame } from "@/engine/context";

/**
 * 03 — Flora Fridays ("flower drop day"). The photograph fills the frame,
 * petals drift across it, and a click anywhere throws a fresh handful.
 */
export function FridaysFrame() {
  const { active } = useFrame();
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const { bursts, spawn } = usePetalBursts();

  // the photo leans a few pixels away from the cursor
  useEffect(() => {
    const el = layer.current;
    if (!active || !el || !finePointer()) return;
    const toX = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      toX((e.clientX / window.innerWidth - 0.5) * -24);
      toY((e.clientY / window.innerHeight - 0.5) * -16);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.to(el, { x: 0, y: 0, duration: 0.6, overwrite: true });
    };
  }, [active]);

  const throwPetals = (e: MouseEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (r) spawn(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <div className="px-gutter pt-nav relative flex h-full min-h-[500px] flex-col pb-[var(--gutter)]">
      <div
        ref={box}
        data-reveal="clip-center"
        data-cursor="tap"
        onClick={throwPetals}
        className="relative mt-1 min-h-[200px] flex-1 cursor-pointer overflow-hidden"
      >
        <div data-media className="absolute inset-0">
          <div ref={layer} className="absolute -inset-[3%]">
            <Img
              photo={FRIDAYS.photo}
              sizes="(min-width: 768px) calc(100vw - 64px), calc(100vw - 48px)"
              className="h-full w-full"
            />
          </div>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-tr from-black/55 via-black/10 to-transparent md:block"
        />
        <AmbientPetals />
        <PetalBursts bursts={bursts} />
        <p
          data-reveal="fade"
          className="t-tiny pointer-events-none absolute right-3 top-3 bg-[#E5DFD2]/95 px-[8px] py-[2px] text-[#25272A] border border-[#D8C8AC] shadow-xs"
        >
          click anywhere — flower drop
        </p>
      </div>

      {/* over the photo on desktop, beneath it (dark ink) on phones — as on the original */}
      <div className="shrink-0 pt-4 md:pointer-events-none md:absolute md:bottom-[calc(var(--gutter)+2.2vw)] md:left-[calc(var(--gutter)+2.4vw)] md:max-w-[min(34rem,42vw)] md:pt-0 md:text-cream">
        <h2 className="t-h2">
          <SplitWords text={FRIDAYS.title} />
        </h2>
        <p data-reveal="up" className="t-h4 mt-2 md:mt-3">
          {FRIDAYS.kicker}
        </p>
        <p data-reveal="up" className="t-body mt-2">
          {FRIDAYS.body}
        </p>
      </div>
    </div>
  );
}
