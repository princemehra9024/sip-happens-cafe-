import gsap from "gsap";

/**
 * Frame-to-frame transitions.
 *
 * TRANSITIONS[k] is the move between frame k and frame k+1 — every edge has
 * its own. Going forward plays it; going back plays its true reverse, so the
 * site feels like one physical stack of pages rather than a slideshow.
 */

export type Dir = 1 | -1;
export type Transition = (
  tl: gsap.core.Timeline,
  from: HTMLElement,
  to: HTMLElement,
  dir: Dir,
) => void;

export const DURATION = 1.25;

const FULL = "inset(0% 0% 0% 0%)";
const CLEAR = "transform,transformOrigin,clipPath,zIndex,boxShadow,filter";

const inner = (el: HTMLElement) => el.querySelector<HTMLElement>("[data-frame-inner]");
const media = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>("[data-media]"));
const stack = (top: HTMLElement, bottom: HTMLElement) => {
  gsap.set(top, { zIndex: 2 });
  gsap.set(bottom, { zIndex: 1 });
};

/** 0 ⇄ 1 · SHEET — a fresh page slides up over the last one with layered 3D depth */
const sheet: Transition = (tl, from, to, dir) => {
  const inInner = inner(to);
  const outInner = inner(from);
  const shadow = "0 -28px 60px rgba(37,39,42,0.22)";

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(to, { yPercent: 100, boxShadow: shadow }, { yPercent: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 0)
      .to(from, { yPercent: -16, scale: 0.94, autoAlpha: 0.35, filter: "blur(2px)" }, 0);
    if (inInner) tl.fromTo(inInner, { yPercent: 14, scale: 0.98 }, { yPercent: 0, scale: 1 }, 0);
    const m = media(from);
    if (m.length) tl.to(m, { yPercent: 10 }, 0);
  } else {
    stack(from, to);
    tl.to(from, { yPercent: 100, boxShadow: shadow }, 0)
      .fromTo(
        to,
        { yPercent: -16, scale: 0.94, autoAlpha: 0.35, filter: "blur(2px)" },
        { yPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)" },
        0,
      );
    if (outInner) tl.to(outInner, { yPercent: 14 }, 0);
    const m = media(to);
    if (m.length) tl.fromTo(m, { yPercent: 10 }, { yPercent: 0 }, 0);
  }
};

/** 1 ⇄ 2 · WINDOW — camera shutter opens with curved aperture & lens drift */
const windowOpen: Transition = (tl, from, to, dir) => {
  const small = "inset(42% 42% 42% 42% round 36px)";
  const shadow = "0 0 70px rgba(37,39,42,0.3)";

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(to, { clipPath: small, boxShadow: shadow }, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 0)
      .to(from, { scale: 0.92, autoAlpha: 0.3, filter: "blur(3px)" }, 0);
    const m = media(to);
    if (m.length) tl.fromTo(m, { scale: 1.25, rotate: -1.5 }, { scale: 1, rotate: 0, duration: DURATION * 1.3, ease: "power3.out" }, 0);
  } else {
    stack(from, to);
    tl.fromTo(from, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, { clipPath: small, boxShadow: shadow }, 0)
      .fromTo(
        to,
        { scale: 0.92, autoAlpha: 0.3, filter: "blur(3px)" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)" },
        0,
      );
    const m = media(from);
    if (m.length) tl.to(m, { scale: 1.25, rotate: 1 }, 0);
  }
};

/** 2 ⇄ 3 · WIPE — sweeping curtain veil with parallax momentum */
const wipe: Transition = (tl, from, to, dir) => {
  const closed = "inset(0% 0% 0% 100%)";
  const inInner = inner(to);
  const outInner = inner(from);
  const shadow = "-24px 0 55px rgba(37,39,42,0.28)";

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(to, { clipPath: closed, boxShadow: shadow }, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 0)
      .to(from, { xPercent: -15, scale: 0.94, autoAlpha: 0.4, filter: "blur(2px)" }, 0);
    if (inInner) tl.fromTo(inInner, { xPercent: 16, scale: 0.98 }, { xPercent: 0, scale: 1 }, 0);
  } else {
    stack(from, to);
    tl.fromTo(from, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, { clipPath: closed, boxShadow: shadow }, 0)
      .fromTo(to, { xPercent: -15, scale: 0.94, autoAlpha: 0.4, filter: "blur(2px)" }, { xPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)" }, 0);
    if (outInner) tl.to(outInner, { xPercent: 16 }, 0);
  }
};

/** 3 ⇄ 4 · IRIS — blooms radially out from the matcha cup */
const iris: Transition = (tl, from, to, dir) => {
  const at = "at 76% 64%";
  const inInner = inner(to);
  const outInner = inner(from);

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(to, { clipPath: `circle(0% ${at})` }, { clipPath: `circle(150% ${at})` }, 0)
      .to(from, { scale: 1.07, autoAlpha: 0.35, filter: "blur(2px)" }, 0);
    if (inInner) tl.fromTo(inInner, { scale: 0.94, yPercent: 6 }, { scale: 1, yPercent: 0 }, 0);
  } else {
    stack(from, to);
    tl.fromTo(from, { clipPath: `circle(150% ${at})` }, { clipPath: `circle(0% ${at})` }, 0)
      .fromTo(
        to,
        { scale: 1.07, autoAlpha: 0.35, filter: "blur(2px)" },
        { scale: 1, autoAlpha: 1, filter: "blur(0px)" },
        0,
      );
    if (outInner) tl.to(outInner, { scale: 0.94, yPercent: 6 }, 0);
  }
};

/** 4 ⇄ 5 · DEAL — dealt onto the pile like a crisp tactile print card */
const deal: Transition = (tl, from, to, dir) => {
  const inInner = inner(to);
  const outInner = inner(from);
  const shadow = "-18px 24px 50px rgba(37,39,42,0.24)";

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(
      to,
      { yPercent: 104, xPercent: 5, rotate: 4.5, transformOrigin: "0% 100%", boxShadow: shadow },
      { yPercent: 0, xPercent: 0, rotate: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
      0,
    ).to(
      from,
      { scale: 0.92, rotate: -2, yPercent: -8, autoAlpha: 0.3, filter: "blur(2px)", transformOrigin: "50% 40%" },
      0,
    );
    if (inInner) tl.fromTo(inInner, { rotate: -1.5 }, { rotate: 0 }, 0);
  } else {
    stack(from, to);
    tl.to(from, { yPercent: 104, xPercent: 5, rotate: 4.5, transformOrigin: "0% 100%", boxShadow: shadow }, 0)
      .fromTo(
        to,
        { scale: 0.92, rotate: -2, yPercent: -8, autoAlpha: 0.3, filter: "blur(2px)", transformOrigin: "50% 40%" },
        { scale: 1, rotate: 0, yPercent: 0, autoAlpha: 1, filter: "blur(0px)" },
        0,
      );
    if (outInner) tl.to(outInner, { rotate: -1.5 }, 0);
  }
};

/** 5 ⇄ 6 · CURTAIN — the dark closing page glides up with arched elegance */
const curtain: Transition = (tl, from, to, dir) => {
  const closed = "inset(100% 0% 0% 0% round 24px 24px 0 0)";
  const inInner = inner(to);
  const outInner = inner(from);
  const shadow = "0 -35px 70px rgba(0,0,0,0.45)";

  if (dir === 1) {
    stack(to, from);
    tl.fromTo(to, { clipPath: closed, boxShadow: shadow }, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 0)
      .to(from, { yPercent: -15, scale: 0.93, autoAlpha: 0.25, filter: "blur(3px)" }, 0);
    if (inInner) tl.fromTo(inInner, { yPercent: 20, scale: 0.97 }, { yPercent: 0, scale: 1 }, 0);
  } else {
    stack(from, to);
    tl.fromTo(from, { clipPath: FULL, boxShadow: "0 0 0 rgba(0,0,0,0)" }, { clipPath: closed, boxShadow: shadow }, 0)
      .fromTo(
        to,
        { yPercent: -15, scale: 0.93, autoAlpha: 0.25, filter: "blur(3px)" },
        { yPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)" },
        0,
      );
    if (outInner) tl.to(outInner, { yPercent: 20, scale: 0.97 }, 0);
  }
};

export const TRANSITIONS: Transition[] = [sheet, windowOpen, wipe, iris, deal, curtain];

/** Used instead of everything above when the visitor prefers reduced motion */
export const crossfade: Transition = (tl, from, to) => {
  stack(to, from);
  tl.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1 }, 0);
};

/** Leave both frames clean once a transition has finished */
export function settle(from: HTMLElement, to: HTMLElement) {
  gsap.set(from, { autoAlpha: 0, clearProps: CLEAR });
  gsap.set(to, { autoAlpha: 1, clearProps: CLEAR });
  const leftovers = [inner(from), inner(to), ...media(from), ...media(to)].filter(
    (el): el is HTMLElement => el !== null,
  );
  if (leftovers.length) gsap.set(leftovers, { clearProps: "transform,filter,opacity" });
}
