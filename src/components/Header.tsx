import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { BRAND, NAV } from "@/data/content";
import { useEngine } from "@/engine/context";
import { cdn } from "@/lib/img";
import { useUI } from "@/ui/UIContext";
import { cn } from "@/utils/cn";

/**
 * Announcement bar + navigation. Stays put while the frames change beneath it;
 * tucks the announcement away after the first frame and swaps to cream ink
 * when the dark closing frame slides under it.
 */
export function Header() {
  const { index, ids, dark, goTo } = useEngine();
  const { annOpen, closeAnn, open, cartCount } = useUI();

  const current = ids[index];
  const tucked = index !== 0;
  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    goTo(id);
  };

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 transition-colors duration-500",
        dark ? "text-[#F0EDE4]" : "text-[#25272A]",
      )}
    >
      <div
        className="transition-transform duration-700 ease-flora"
        style={{ transform: tucked ? "translateY(calc(-1 * var(--ann-h)))" : "none" }}
      >
        {/* announcement */}
        <div
          inert={tucked || !annOpen}
          className="pointer-events-auto relative flex h-[var(--ann-h)] items-center justify-center overflow-hidden bg-[#526044] text-[#F0EDE4] transition-[height] duration-500 ease-flora border-b border-[#EACB83]/20"
        >
          <a
            href="#menu"
            onClick={jump("menu")}
            className="link-line px-10 font-serif text-[0.85rem] leading-none tracking-[0.02em]"
          >
            {BRAND.announcement}
          </a>
          <button
            type="button"
            onClick={closeAnn}
            aria-label="Dismiss announcement"
            className="absolute right-0 top-0 grid h-full w-10 place-items-center text-[1.1rem] leading-none text-[#EACB83] opacity-85 transition-opacity hover:opacity-100"
          >
            ×
          </button>
        </div>

        {/* navigation - warm ivory backdrop */}
        <div
          className={cn(
            "px-gutter pointer-events-auto flex h-[var(--nav-h)] items-center transition-all duration-500",
            dark
              ? "bg-[#25272A]/90 backdrop-blur-md border-b border-[#35383C]/70 shadow-xs"
              : "bg-[#E5DFD2]/92 backdrop-blur-md border-b border-[#D8C8AC]/60 shadow-xs",
          )}
        >
          <a
            href="#home"
            onClick={jump("home")}
            aria-label={`${BRAND.name} — home`}
            className="flex shrink-0 items-center gap-[1.1vw]"
          >
            <span className="relative block aspect-[346/141] h-[42px] md:h-[clamp(44px,4.5vw,66px)]">
              <img
                src={cdn(BRAND.logo, 500)}
                alt=""
                width={346}
                height={141}
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full transition-opacity duration-500 [filter:url(#ink-charcoal)]",
                  dark && "opacity-0",
                )}
              />
              {/* same file, re-inked cream for the dark frame */}
              <img
                src={cdn(BRAND.logo, 500)}
                alt=""
                aria-hidden
                width={346}
                height={141}
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full transition-opacity duration-500 [filter:url(#ink-cream)]",
                  !dark && "opacity-0",
                )}
              />
            </span>
            <span className="hidden font-serif text-[clamp(11px,0.92vw,13.5px)] italic leading-[1.25] lg:block">
              <span className="font-semibold text-[#526044] tracking-wide">{BRAND.tagline[0]}</span>
              <br />
              <span className="tracking-widest uppercase text-[10px] text-[#25272A]/80">{BRAND.tagline[1]}</span>
            </span>
          </a>

          <nav aria-label="Primary" className="ml-[4.6vw] hidden md:block">
            <ul className="flex items-center gap-[1.85vw]">
              {NAV.map((item) => (
                <li key={item.label}>
                  {item.frame ? (
                    <a
                      href={`#${item.frame}`}
                      onClick={jump(item.frame)}
                      aria-current={item.frame === current && item.frame !== "home" ? "true" : undefined}
                      className="t-nav link-line"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="t-nav link-line">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-[max(2.4vw,18px)]">
            <button type="button" onClick={() => open("search")} className="t-nav link-line hidden md:block">
              Search
            </button>
            <button
              type="button"
              onClick={() => open("cart")}
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className="t-nav link-line"
            >
              Cart
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  className="ml-1 inline-block text-flora"
                >
                  ({cartCount})
                </motion.span>
              )}
            </button>
            <button
              type="button"
              onClick={() => open("menu")}
              aria-haspopup="dialog"
              className="t-nav link-line md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
