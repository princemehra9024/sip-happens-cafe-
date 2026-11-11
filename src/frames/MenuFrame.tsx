import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DrinkTray } from "@/characters/DrinkTray";
import { Divider } from "@/components/Divider";
import { Img } from "@/components/Img";
import { SplitWords } from "@/components/SplitWords";
import { FALL_PHOTOS, MENU, MENU_INTRO, type MenuGroup, type MenuItem } from "@/data/content";
import { useFrame } from "@/engine/context";
import { useMedia } from "@/lib/useMedia";
import { cn } from "@/utils/cn";

// Desktop reads Coffee | Tea on the first row, Milk | Fall on the second
const GRID_ORDER = [0, 2, 1, 3];

function MenuTable({
  group,
  mobileHidden,
  picked,
  onPick,
}: {
  group: MenuGroup;
  mobileHidden: boolean;
  picked: MenuItem | null;
  onPick: (item: MenuItem | null) => void;
}) {
  return (
    <section aria-label={group.title} className={cn(mobileHidden && "hidden md:block")}>
      <h3 data-reveal="up" data-step="0.04" className="t-large pb-3 md:pb-[1.05rem] text-[#25272A]">
        {group.title}
      </h3>
      <ul className="space-y-1">
        {group.items.map((item) => {
          const isPicked = picked === item;
          return (
            <li
              key={item.name}
              data-reveal="right"
              data-step="0.03"
              onPointerEnter={() => onPick(item)}
              onPointerLeave={(e) => e.pointerType === "mouse" && onPick(null)}
              onClick={() => onPick(isPicked ? null : item)}
              className={cn(
                "group relative flex cursor-pointer items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg transition-all duration-300 ease-out select-none",
                isPicked
                  ? "bg-[#E5DFD2]/90 shadow-xs translate-x-1.5 border border-[#D8C8AC]"
                  : "hover:bg-[#E5DFD2]/45 hover:translate-x-1 border border-transparent",
              )}
            >
              {/* Left active indicator star in warm gold */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-block shrink-0 transition-all duration-300 text-[#EACB83] text-[11px]",
                    isPicked
                      ? "opacity-100 scale-100 rotate-0 w-3"
                      : "opacity-0 scale-50 -rotate-45 w-0 overflow-hidden",
                  )}
                  aria-hidden
                >
                  ✦
                </span>

                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "t-h4 block transition-all duration-300 origin-left tracking-wide",
                      isPicked
                        ? "text-[1.12rem] font-semibold text-[#25272A] scale-[1.03]"
                        : "text-[1rem] text-[#25272A]/90 group-hover:text-[#25272A] group-hover:scale-[1.015]",
                    )}
                  >
                    {item.name}
                  </span>
                  {item.note && (
                    <span
                      className={cn(
                        "t-note block max-w-[17rem] pt-[1px] transition-colors duration-300",
                        isPicked ? "text-[#526044] font-medium" : "text-[#526044]/80",
                      )}
                    >
                      {item.note}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting leader line on hover */}
              <span
                className={cn(
                  "hidden sm:block flex-1 border-b border-dashed transition-all duration-300 mx-2",
                  isPicked
                    ? "border-[#C5B397] opacity-80"
                    : "border-transparent opacity-0 group-hover:border-[#D8C8AC]/60 group-hover:opacity-40",
                )}
                aria-hidden
              />

              {/* Price Tag with custom badge design on hover */}
              <span
                className={cn(
                  "t-price shrink-0 transition-all duration-300 font-mono tracking-tight",
                  isPicked
                    ? "scale-110 bg-[#25272A] text-[#EACB83] px-2.5 py-0.5 rounded-sm shadow-xs font-bold text-[1.05rem]"
                    : "text-[#25272A] group-hover:text-[#526044] group-hover:scale-105",
                )}
              >
                {item.price}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * 02 — Menu. Hover (or tap) any drink and the glass on the tray pours to
 * match; the fall specials also bring up their photograph.
 */
export function MenuFrame() {
  const { active } = useFrame();
  const desktop = useMedia("(min-width: 768px)");
  const [tab, setTab] = useState(0);
  const [picked, setPicked] = useState<MenuItem | null>(null);
  const [cycle, setCycle] = useState(0);
  const [opened, setOpened] = useState(false);
  if (active && !opened) setOpened(true);

  // the photo wanders through the fall drinks on its own
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setCycle((c) => (c + 1) % FALL_PHOTOS.length), 3800);
    return () => window.clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) setPicked(null);
  }, [active]);

  const shown = picked?.photo ?? cycle;

  // One gallery, mounted in the left column on desktop and under the list on
  // phones — never both, so no photo is ever downloaded twice.
  const gallery = (
    <div
      data-reveal={desktop ? "clip-down" : "clip-up"}
      className="relative min-h-0 flex-1 overflow-hidden md:mt-5 md:max-h-[36vw]"
    >
      <div data-media className="absolute inset-0">
        {FALL_PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === shown ? "opacity-100" : "opacity-0",
            )}
          >
            <Img
              photo={photo}
              sizes="(min-width: 768px) 29vw, calc(100vw - 48px)"
              max={1000}
              hold={i > 0 && !opened}
              className="h-full w-full"
            />
          </div>
        ))}
      </div>
      <span className="t-tiny absolute bottom-2 left-2 bg-[#E5DFD2]/95 px-[7px] py-[2px] text-[#25272A] border border-[#D8C8AC] shadow-xs">
        {FALL_PHOTOS[shown].alt}
      </span>
    </div>
  );

  return (
    <div className="px-gutter pt-nav flex h-full min-h-[560px] flex-col">
      <div className="grid-24 min-h-0 flex-1 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-y-4 pt-3 md:grid-rows-1 md:pt-[2.4vh]">
        {/* introduction (+ photo on desktop) */}
        <div className="col-span-24 flex min-h-0 flex-col md:col-span-6 lg:col-span-7">
          <h2 className="t-h2">
            <SplitWords text={MENU_INTRO.title} />
          </h2>
          <p data-reveal="up" className="t-body mt-2 max-w-[24rem] md:mt-3">
            {MENU_INTRO.body}
          </p>
          {desktop && gallery}
        </div>

        {/* category tabs (phones) */}
        <div data-reveal="fade" role="tablist" aria-label="Menu sections" className="col-span-24 flex gap-2 md:hidden">
          {MENU.map((group, i) => (
            <button
              key={group.title}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className="t-btn relative px-[7px] py-[1px]"
            >
              {i === tab && (
                <motion.span
                  layoutId="menu-tab"
                  className="absolute inset-0 bg-flora"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={cn("relative transition-colors duration-300", i === tab && "text-cream")}>
                {group.short}
              </span>
            </button>
          ))}
        </div>

        {/* the four lists */}
        <div className="col-span-24 grid content-start gap-x-[9%] gap-y-[4.2vh] md:col-span-17 md:col-start-8 md:grid-cols-2 lg:col-span-14 lg:col-start-10 lg:gap-x-[14%]">
          {GRID_ORDER.map((gi) => (
            <MenuTable key={MENU[gi].title} group={MENU[gi]} mobileHidden={gi !== tab} picked={picked} onPick={setPicked} />
          ))}
        </div>

        {/* photo fills whatever height is left on phones (dropped on very short screens) */}
        {!desktop && (
          <div className="col-span-24 flex min-h-0 flex-col [@media(max-height:699px)]:hidden">{gallery}</div>
        )}
      </div>

      {/* the tray sits on the end of the rule, as it does on the original */}
      <div className="relative shrink-0 pb-5 pt-2 md:pb-7">
        <div className="flex items-end justify-end gap-3 md:gap-5">
          <p data-reveal="fade" aria-live="polite" className="t-tiny max-w-[62%] pb-[22px] text-right">
            {picked ? (
              <span key={picked.name} className="fade-up inline-block text-[#526044] font-semibold text-[13px] tracking-wide">
                {picked.name} — {picked.price} →
              </span>
            ) : (
              <span className="opacity-70">{desktop ? "Point or hover" : "Tap"} a drink and watch it pour →</span>
            )}
          </p>
          <div data-reveal="zoom" className="relative z-10 -mb-[16px] shrink-0">
            <DrinkTray
              level={picked ? picked.pour : 0.15}
              className="h-auto w-[clamp(118px,13.5vw,200px)] text-flora"
            />
          </div>
        </div>
        <Divider />
      </div>
    </div>
  );
}
