import gsap from "gsap";

/**
 * Declarative entrance choreography.
 *
 * Any element inside a frame can opt in with `data-reveal="<preset>"`.
 * When a frame becomes current the engine plays its elements in DOM order:
 *
 *   data-reveal="up|down|left|right|fade|zoom|clip-up|clip-down|clip-left|clip-right|clip-center|words"
 *   data-step="0.03"   gap before the next element (default 0.08s)
 *   data-at="0.4"      absolute start time instead of the running cursor
 */

type Preset = { from: gsap.TweenVars; to: gsap.TweenVars };

const FULL = "inset(0% 0% 0% 0%)";

const slide = (from: gsap.TweenVars): Preset => ({
  from: { autoAlpha: 0, filter: "blur(5px)", ...from },
  to: { autoAlpha: 1, filter: "blur(0px)", x: 0, y: 0, duration: 1.05, ease: "power4.out", clearProps: "filter" },
});

const clip = (from: string): Preset => ({
  from: { autoAlpha: 1, clipPath: from },
  to: { clipPath: FULL, duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" },
});

const PRESETS: Record<string, Preset> = {
  up: slide({ y: 32 }),
  down: slide({ y: -26 }),
  left: slide({ x: 48 }),
  right: slide({ x: -36 }),
  fade: {
    from: { autoAlpha: 0, filter: "blur(4px)" },
    to: { autoAlpha: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out", clearProps: "filter" },
  },
  zoom: {
    from: { autoAlpha: 0, scale: 0.82, filter: "blur(4px)" },
    to: { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.15, ease: "back.out(1.4)", clearProps: "filter" },
  },
  "clip-up": clip("inset(100% 0% 0% 0%)"),
  "clip-down": clip("inset(0% 0% 100% 0%)"),
  "clip-right": clip("inset(0% 100% 0% 0%)"),
  "clip-left": clip("inset(0% 0% 0% 100%)"),
  "clip-center": clip("inset(50% 0% 50% 0%)"),
};

/** Headline words rise out of their own masks (see <SplitWords>) */
const WORDS: Preset = {
  from: { yPercent: 125, rotate: 5, opacity: 0, filter: "blur(4px)" },
  to: {
    yPercent: 0,
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.05,
    ease: "power4.out",
    stagger: 0.045,
    clearProps: "filter",
  },
};

const targets = (frame: HTMLElement) => frame.querySelectorAll<HTMLElement>("[data-reveal]");
const words = (el: HTMLElement) => el.querySelectorAll<HTMLElement>(".w > span");

/**
 * Put every reveal element of a frame into its "before" state.
 * `keep` lets the caller leave some elements visible — on first load the
 * hero photo (the LCP element) must paint immediately, not wait for a reveal.
 */
export function hideReveals(frame: HTMLElement, keep?: (el: HTMLElement) => boolean) {
  targets(frame).forEach((el) => {
    if (keep?.(el)) return;
    const kind = el.dataset.reveal ?? "up";
    if (kind === "words") {
      gsap.set(el, { autoAlpha: 1 });
      gsap.set(words(el), WORDS.from);
    } else {
      gsap.set(el, (PRESETS[kind] ?? PRESETS.up).from);
    }
  });
}

/** Build (and start) the entrance timeline for a frame */
export function playReveals(frame: HTMLElement, delay = 0) {
  const tl = gsap.timeline({ delay });
  let cursor = 0;

  targets(frame).forEach((el) => {
    const kind = el.dataset.reveal ?? "up";
    const at = el.dataset.at !== undefined ? parseFloat(el.dataset.at) : cursor;
    if (el.dataset.at === undefined) {
      cursor += el.dataset.step !== undefined ? parseFloat(el.dataset.step) : 0.08;
    }
    if (kind === "words") tl.to(words(el), WORDS.to, at);
    else tl.to(el, (PRESETS[kind] ?? PRESETS.up).to, at);
  });

  return tl;
}
