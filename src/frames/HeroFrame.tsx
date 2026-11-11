import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FlowerVase } from "@/characters/FlowerVase";
import { Img } from "@/components/Img";
import { LabelLink } from "@/components/Label";
import { SplitWords } from "@/components/SplitWords";
import { HERO_SLIDES, INTRO } from "@/data/content";
import { useFrame } from "@/engine/context";
import { cn } from "@/utils/cn";

// Must match the <link rel="preload"> in index.html
const SIZES = "(min-width: 768px) calc(100vw - 64px), calc(100vw - 48px)";
const SLIDE_SECONDS = 6;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 01 — Home: the photo slideshow with the introduction beneath it,
 * and the flower that follows the cursor.
 */
export function HeroFrame() {
  const { active } = useFrame();
  const root = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  // Bitmask of slides allowed to download. Only the first is fetched up front;
  // each following photo is requested a few seconds before its turn, so a
  // visitor who scrolls straight on never pays for photos they didn't see.
  const [allowed, setAllowed] = useState(1);
  const total = HERO_SLIDES.length;
  const allow = (i: number) => setAllowed((mask) => mask | (1 << i));

  // Autoplay — the progress bar under the photo *is* the timer
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const bars = Array.from(el.querySelectorAll<HTMLElement>("[data-bar]"));
    gsap.set(bars, { scaleX: (i: number) => (i < slide ? 1 : 0) });
    if (!active) return;

    const timer = gsap.to(bars[slide], {
      scaleX: 1,
      duration: SLIDE_SECONDS,
      ease: "none",
      onComplete: () => setSlide((s) => (s + 1) % total),
    });
    const photo = el.querySelector<HTMLElement>(`[data-kb="${slide}"]`);
    const drift = photo ? gsap.fromTo(photo, { scale: 1.1 }, { scale: 1, duration: 8, ease: "power1.out" }) : null;
    const fetchNext = window.setTimeout(() => allow((slide + 1) % total), 2500);

    return () => {
      timer.kill();
      drift?.kill();
      window.clearTimeout(fetchNext);
    };
  }, [active, slide, total]);

  const show = (i: number) => {
    allow(i);
    setSlide(i);
  };

  return (
    <div ref={root} className="px-gutter pt-hero flex h-full min-h-[520px] flex-col">
      {/* slideshow — data-lcp: on first load it paints immediately, no reveal */}
      <div data-reveal="clip-up" data-lcp className="relative min-h-0 flex-1 overflow-hidden">
        <div data-media className="absolute inset-0">
          {HERO_SLIDES.map((photo, i) => (
            <div
              key={photo.src}
              aria-hidden={i !== slide}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1200ms] ease-out",
                i === slide ? "opacity-100" : "opacity-0",
              )}
            >
              <div data-kb={i} className="absolute inset-0">
                <Img
                  photo={photo}
                  sizes={SIZES}
                  priority={i === 0}
                  hold={(allowed & (1 << i)) === 0}
                  className="h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 bottom-2 z-10 flex items-center gap-2 md:inset-x-4 md:bottom-3">
          {HERO_SLIDES.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => show(i)}
              aria-label={`Photo ${i + 1} of ${total}`}
              aria-current={i === slide ? "true" : undefined}
              className="grid h-7 w-9 place-items-center md:w-12"
            >
              <span className="block h-[2px] w-full overflow-hidden bg-cream/40">
                <span
                  data-bar
                  className="block h-full w-full origin-left bg-cream"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </button>
          ))}
          <span className="t-tiny ml-auto text-cream [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]">
            {pad(slide + 1)} / {pad(total)}
          </span>
        </div>
      </div>

      {/* introduction */}
      <div className="grid-24 shrink-0 items-start gap-y-3 pb-5 pt-4 md:pb-[3.2vh] md:pt-[2.8vh]">
        <h1 className="t-h1 col-span-24 col-start-1 row-start-1 md:col-span-8 md:whitespace-nowrap">
          <SplitWords text={INTRO.title} />
        </h1>

        <div
          data-reveal="fade"
          className="col-span-6 col-start-19 row-start-2 h-[112px] justify-self-end md:col-span-4 md:col-start-9 md:row-start-1 md:h-[clamp(120px,19vh,190px)] md:justify-self-center"
        >
          <FlowerVase className="h-full w-auto text-flora" />
        </div>

        <div className="col-span-18 col-start-1 row-start-2 md:col-span-10 md:col-start-14 md:row-start-1">
          <p data-reveal="up" className="t-body max-w-[35rem]">
            {INTRO.body}
          </p>
          <div data-reveal="up" className="mt-3 flex items-center justify-between gap-4">
            <LabelLink href={INTRO.cta.href}>{INTRO.cta.label}</LabelLink>
            <span className="t-tiny hidden items-center gap-2 opacity-70 md:flex">
              <span className="bob inline-block">↓</span> scroll — one frame at a time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
