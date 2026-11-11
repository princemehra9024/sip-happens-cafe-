import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { whenFontsReady } from "@/lib/fonts";
import { hideReveals, playReveals } from "./reveal";
import { DURATION, TRANSITIONS, crossfade, settle, type Dir } from "./transitions";

gsap.registerPlugin(Observer);

/**
 * The frame engine: one gesture moves exactly one frame.
 *
 *  • Wheel / trackpad — a gesture is everything until the wheel has been quiet
 *    for a moment, so trackpad inertia can never skip a second frame.
 *  • Touch — one swipe (press → release) can move at most one frame.
 *  • Keyboard — arrows, PageUp/PageDown, Space, Home, End.
 *  • If a frame's own content overflows (tiny screens), that scrolls first.
 */

export interface FrameEngine {
  /** Frame currently shown (changes the moment a transition starts) */
  index: number;
  count: number;
  ids: readonly string[];
  /** True while a dark frame sits under the header */
  dark: boolean;
  goTo: (target: number | string) => void;
  /** Pause gesture handling while an overlay is open */
  lock: (locked: boolean) => void;
  /** One ref callback per frame */
  refs: ((el: HTMLElement | null) => void)[];
}

const WHEEL_QUIET_MS = 170;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useFrameEngine(ids: readonly string[], darkIds: readonly string[] = []): FrameEngine {
  const count = ids.length;

  const start = useMemo(() => {
    const i = ids.indexOf(window.location.hash.slice(1));
    return i < 0 ? 0 : i;
  }, [ids]);

  const els = useRef<(HTMLElement | null)[]>([]);
  const reveals = useRef<(gsap.core.Timeline | undefined)[]>([]);
  const state = useRef({
    current: start,
    animating: false,
    locked: false,
    lastWheel: 0,
    wheelSpent: false,
    touchSpent: false,
  });

  const [index, setIndex] = useState(start);
  const [dark, setDark] = useState(() => darkIds.includes(ids[start]));

  const refs = useMemo(
    () =>
      ids.map((_, i) => (el: HTMLElement | null) => {
        els.current[i] = el;
      }),
    [ids],
  );

  const reveal = useCallback((i: number, delay: number) => {
    const el = els.current[i];
    if (!el) return;
    reveals.current[i]?.kill();
    const tl = playReveals(el, delay);
    if (reducedMotion()) tl.progress(1);
    reveals.current[i] = tl;
  }, []);

  const goTo = useCallback(
    (t: number | string) => {
      const s = state.current;
      let target = typeof t === "string" ? ids.indexOf(t) : t;
      if (target < 0 || Number.isNaN(target) || s.animating) return;
      target = Math.min(count - 1, Math.max(0, target));

      const from = els.current[s.current];
      const to = els.current[target];
      if (!from || !to) return;

      // Already here: replay the entrance so the click still gets an answer
      if (target === s.current) {
        reveals.current[target]?.kill();
        hideReveals(to);
        reveal(target, 0);
        return;
      }

      const dir: Dir = target > s.current ? 1 : -1;
      const reduce = reducedMotion();
      const play = reduce ? crossfade : TRANSITIONS[(dir === 1 ? target - 1 : target) % TRANSITIONS.length];
      const total = reduce ? 0.35 : DURATION;
      const nextDark = darkIds.includes(ids[target]);

      s.animating = true;
      s.current = target;
      setIndex(target);
      try {
        window.history.replaceState(null, "", `#${ids[target]}`);
      } catch {
        /* sandboxed previews may refuse history writes — navigation still works */
      }

      reveals.current[target]?.kill();
      hideReveals(to);
      to.querySelector<HTMLElement>("[data-frame-scroll]")?.scrollTo(0, 0);
      gsap.set(to, { autoAlpha: 1 });

      const finish = () => {
        settle(from, to);
        s.animating = false;
      };

      try {
        const tl = gsap.timeline({ defaults: { duration: total, ease: "power4.inOut" }, onComplete: finish });
        play(tl, from, to, dir);
        // Flip the header colours as the edge of the dark page passes under it
        tl.call(() => setDark(nextDark), undefined, total * (dir === 1 ? 0.78 : 0.18));
      } catch {
        setDark(nextDark);
        finish();
      }

      reveal(target, total * 0.42);
    },
    [count, darkIds, ids, reveal],
  );

  const lock = useCallback((locked: boolean) => {
    state.current.locked = locked;
  }, []);

  /* ---- initial state: only the starting frame is visible ---- */
  useLayoutEffect(() => {
    els.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: i === start ? 1 : 0 });
      // On the landing frame, anything marked data-lcp paints straight away
      hideReveals(el, i === start ? (node) => node.hasAttribute("data-lcp") : undefined);
    });

    // Wait for the real fonts so headlines don't re-wrap mid-animation
    let cancelled = false;
    whenFontsReady().then(() => {
      if (!cancelled) reveal(start, 0.05);
    });

    const timelines = reveals.current;
    return () => {
      cancelled = true;
      timelines.forEach((tl) => tl?.kill());
    };
  }, [reveal, start]);

  /* ---- gestures ---- */
  useEffect(() => {
    const s = state.current;

    /** Can the current frame's own content still scroll that way? */
    const scroller = () => els.current[s.current]?.querySelector<HTMLElement>("[data-frame-scroll]") ?? null;
    const innerCanScroll = (dir: number) => {
      const sc = scroller();
      if (!sc) return false;
      const max = sc.scrollHeight - sc.clientHeight;
      if (max <= 2) return false;
      return dir > 0 ? sc.scrollTop < max - 2 : sc.scrollTop > 2;
    };

    const intent = (dir: Dir, kind: "wheel" | "touch") => {
      const spent = kind === "wheel" ? "wheelSpent" : "touchSpent";
      if (s[spent]) return;
      s[spent] = true; // this gesture has had its one say
      if (s.locked || s.animating) return;
      if (innerCanScroll(dir)) return;
      goTo(s.current + dir);
    };

    const wheel = Observer.create({
      target: window,
      type: "wheel",
      tolerance: 0,
      preventDefault: false,
      onWheel: (self) => {
        const now = performance.now();
        if (now - s.lastWheel > WHEEL_QUIET_MS) s.wheelSpent = false; // a pause = a new gesture
        s.lastWheel = now;
        const dy = self.deltaY;
        if (Math.abs(dy) < 3 || Math.abs(dy) < Math.abs(self.deltaX)) return;
        intent(dy > 0 ? 1 : -1, "wheel");
      },
    });

    const touch = Observer.create({
      target: window,
      type: "touch",
      tolerance: 28,
      lockAxis: true,
      preventDefault: false,
      onPress: () => {
        s.touchSpent = false;
      },
      onUp: () => intent(1, "touch"), // finger travels up → next frame
      onDown: () => intent(-1, "touch"),
    });

    const onKey = (e: KeyboardEvent) => {
      if (s.locked || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;

      let dir = 0;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          dir = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          dir = -1;
          break;
        case " ":
          if (t?.closest("a, button, [role='button']")) return; // Space activates controls
          dir = e.shiftKey ? -1 : 1;
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          return;
        case "End":
          e.preventDefault();
          goTo(count - 1);
          return;
        default:
          return;
      }

      e.preventDefault();
      if (innerCanScroll(dir)) {
        const sc = scroller();
        sc?.scrollBy({ top: dir * sc.clientHeight * 0.6, behavior: "smooth" });
      } else {
        goTo(s.current + dir);
      }
    };

    const onHash = () => goTo(window.location.hash.slice(1));

    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      wheel.kill();
      touch.kill();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [count, goTo]);

  return useMemo(
    () => ({ index, count, ids, dark, goTo, lock, refs }),
    [index, count, ids, dark, goTo, lock, refs],
  );
}
