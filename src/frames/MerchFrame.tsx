import { useEffect, useRef, useState, type FocusEvent } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { clamp } from "@/characters/kit";
import { CafeShop } from "@/characters/CafeShop";
import { Divider } from "@/components/Divider";
import { Img } from "@/components/Img";
import { LabelButton, LabelLink } from "@/components/Label";
import { SplitWords } from "@/components/SplitWords";
import { MERCH, PRODUCTS, money, type Product } from "@/data/content";
import { useUI } from "@/ui/UIContext";

const GLIDE = { type: "spring" as const, stiffness: 120, damping: 20 };

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: string) => void }) {
  return (
    <article
      data-reveal="up"
      data-step="0.07"
      className="w-[min(72vw,calc((100dvh-17.5rem)*0.62))] shrink-0 md:w-[clamp(260px,min(28.5vw,calc((100dvh-19.5rem)*0.82)),430px)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="group relative aspect-[2/3] overflow-hidden md:aspect-[4/5] rounded-xs">
        <Img
          photo={product.photo}
          sizes="(min-width: 768px) 28.5vw, 72vw"
          max={1000}
          className="h-full w-full transition-transform duration-[1200ms] ease-flora group-hover:scale-[1.05]"
        />
        {product.soldOut && (
          <span className="t-btn absolute left-2 top-2 bg-[#E5DFD2]/95 px-[8px] py-[2px] text-[#25272A] border border-[#D8C8AC] shadow-xs">Sold out</span>
        )}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 transition duration-500 ease-flora md:translate-y-[160%] md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {product.soldOut ? <span /> : <LabelButton onClick={() => onAdd(product.id)}>Add to cart</LabelButton>}
          <LabelLink href={product.href}>Read more →</LabelLink>
        </div>
      </div>

      <h3 className="t-h4 mt-4 text-center">{product.title}</h3>
      <p className="t-note mx-auto mt-1 line-clamp-2 max-w-[19rem] text-center">{product.excerpt}</p>
      <p className="t-note mt-2 text-center">
        {money(product.price)}
        {product.was && <s className="ml-2 opacity-60">{money(product.was)}</s>}
        {product.variant && <span> · {product.variant}</span>}
      </p>
    </article>
  );
}

/**
 * 05 — Flora Merch / Café Goods. A drag-to-browse shelf (also arrow buttons / keyboard);
 * in-stock pieces can be added to the cart from here.
 * Features an interactive Café Shop micro-interaction illustration and a peeking card overlap effect.
 */
export function MerchFrame() {
  const { add } = useUI();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);

  // how far the shelf can travel
  useEffect(() => {
    const v = viewport.current;
    const t = track.current;
    if (!v || !t) return;
    const measure = () => {
      const next = Math.min(0, v.clientWidth - t.scrollWidth);
      setLimit(next);
      if (x.get() < next) x.set(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(v);
    ro.observe(t);
    return () => ro.disconnect();
  }, [x]);

  const glideTo = (target: number) => animate(x, clamp(target, limit, 0), GLIDE);

  const nudge = (dir: 1 | -1) => {
    const t = track.current;
    const card = t?.querySelector<HTMLElement>("article");
    const gap = t ? parseFloat(getComputedStyle(t).columnGap) || 0 : 0;
    const cards = window.innerWidth >= 768 ? 2 : 1;
    glideTo(x.get() - dir * ((card?.offsetWidth ?? 320) + gap) * cards);
  };

  // keyboard users: bring a focused card fully onto the shelf
  const reveal = (e: FocusEvent) => {
    const v = viewport.current?.getBoundingClientRect();
    const c = (e.target as HTMLElement).closest("article")?.getBoundingClientRect();
    if (!v || !c) return;
    if (c.right > v.right - 24) glideTo(x.get() - (c.right - v.right + 32));
    else if (c.left < v.left + 24) glideTo(x.get() + (v.left - c.left + 32));
  };

  return (
    <div className="pt-nav flex h-full min-h-[520px] flex-col">
      <div className="px-gutter relative flex shrink-0 items-end justify-between gap-4 pb-4 pt-3 md:pb-[2.4vh] md:pt-[2vh]">
        <div className="flex items-end gap-3 sm:gap-5 lg:gap-7">
          {/* Interactive Café Shop SVG illustration — shifted to the left side and enhanced in size */}
          <div
            data-reveal="zoom"
            className="w-[100px] sm:w-[155px] md:w-[210px] lg:w-[260px] xl:w-[290px] shrink-0 -mb-2"
          >
            <CafeShop className="h-auto w-full drop-shadow-[0_6px_20px_rgba(37,39,42,0.08)]" />
          </div>
          <h2 className="t-h2 pb-1 md:pb-2">
            <SplitWords text={MERCH.title} />
          </h2>
        </div>

        <div data-reveal="left" className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={limit === 0}
            aria-label="Previous products"
            className="t-btn px-1 transition-opacity hover:text-flora disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={limit === 0}
            aria-label="Next products"
            className="t-btn px-1 transition-opacity hover:text-flora disabled:opacity-30"
          >
            →
          </button>
          <LabelLink href={MERCH.cta.href}>{MERCH.cta.label}</LabelLink>
        </div>
      </div>

      <div ref={viewport} data-cursor="drag" className="relative min-h-0 flex-1 overflow-clip">
        {/* Soft edge fade mask to make the right card gracefully overlap and peek */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-gradient-to-l from-[#F0EDE4] via-[#F0EDE4]/80 to-transparent md:w-28"
        />

        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: limit, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={() => {
            window.setTimeout(() => (dragged.current = false), 0);
          }}
          onClickCapture={(e) => {
            // a drag that ends on a button must not count as a click
            if (dragged.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onFocusCapture={reveal}
          style={{ x }}
          className="px-gutter flex w-max cursor-grab touch-pan-y gap-[2.4vw] active:cursor-grabbing max-md:gap-4 pr-12 md:pr-20"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={add} />
          ))}
        </motion.div>
      </div>

      <div className="px-gutter shrink-0 pb-6 pt-3 md:pb-7">
        <Divider />
      </div>
    </div>
  );
}
