import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LabelButton, LabelLink } from "@/components/Label";
import { BRAND, FOOTER, FRAMES, MENU, MERCH, NAV, POSTS, PRODUCTS, money } from "@/data/content";
import { useEngine } from "@/engine/context";
import { cdn } from "@/lib/img";
import { cn } from "@/utils/cn";
import { useUI } from "./UIContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/* ------------------------------------------------------------------ */
/*  Shared sheet: slides in, takes focus, keeps Tab inside             */
/* ------------------------------------------------------------------ */
function Sheet({
  label,
  from,
  className,
  children,
}: {
  label: string;
  from: "top" | "right";
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  }, []);

  const trapTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const off = from === "top" ? { y: "-100%" } : { x: "100%" };
  const on = from === "top" ? { y: 0 } : { x: 0 };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onKeyDown={trapTab}
      className={cn("paper fixed z-[55] text-maroon", className)}
      initial={off}
      animate={on}
      exit={off}
      transition={{ type: "tween", duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function CloseButton({ autoFocus = false }: { autoFocus?: boolean }) {
  const { close } = useUI();
  return (
    <button type="button" onClick={close} data-autofocus={autoFocus || undefined} className="t-nav link-line">
      Close
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Search — finds a drink, product, post or page and jumps to it      */
/* ------------------------------------------------------------------ */
interface Hit {
  kind: string;
  title: string;
  meta: string;
  frame: string;
}

const SEARCH_INDEX: Hit[] = [
  ...FRAMES.map((f) => ({ kind: "Page", title: f.label, meta: f.blurb, frame: f.id })),
  ...MENU.flatMap((g) =>
    g.items.map((it) => ({ kind: "Menu", title: it.name, meta: `${g.title} · ${it.price}`, frame: "menu" })),
  ),
  ...PRODUCTS.map((p) => ({
    kind: "Goods",
    title: p.title,
    meta: p.soldOut ? "Sold out" : money(p.price),
    frame: "shop",
  })),
  ...POSTS.map((p) => ({ kind: "Journal", title: p.title, meta: p.category, frame: "journal" })),
];

function SearchPanel() {
  const { close } = useUI();
  const { goTo } = useEngine();
  const [query, setQuery] = useState("");

  const hits = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return SEARCH_INDEX.filter((h) => h.kind === "Page");
    return SEARCH_INDEX.filter((h) => `${h.title} ${h.meta} ${h.kind}`.toLowerCase().includes(term)).slice(0, 12);
  }, [query]);

  const pick = (frame: string) => {
    close();
    goTo(frame);
  };

  return (
    <Sheet label="Search" from="top" className="inset-x-0 top-0 max-h-[100dvh] overflow-y-auto">
      <div className="px-gutter pb-8 pt-5">
        <div className="flex items-center justify-between">
          <span className="t-tiny">Search</span>
          <CloseButton />
        </div>

        <input
          data-autofocus
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          aria-label="Search the site"
          autoComplete="off"
          className="t-h1 mt-4 w-full border-b border-maroon/35 bg-transparent pb-3 transition-colors placeholder:text-maroon/35 focus:border-maroon focus:outline-none"
        />

        <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
          {hits.map((hit) => (
            <li key={`${hit.kind}-${hit.title}`}>
              <button
                type="button"
                onClick={() => pick(hit.frame)}
                className="group flex w-full items-baseline justify-between gap-4 border-b border-maroon/15 py-[10px] text-left"
              >
                <span className="t-large transition-colors duration-300 group-hover:text-flora">{hit.title}</span>
                <span className="t-tiny shrink-0 opacity-70">
                  {hit.kind} · {hit.meta}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {hits.length === 0 && (
          <p className="t-body mt-6" role="status">
            Nothing by that name yet — try “matcha”, “latte” or “crewneck”.
          </p>
        )}
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Cart                                                               */
/* ------------------------------------------------------------------ */
function CartPanel() {
  const { cart, setQty, close } = useUI();
  const { goTo } = useEngine();

  const lines = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ product: p, qty: cart[p.id] }));
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const step = "t-btn grid h-6 w-6 place-items-center border border-maroon/40 transition-colors hover:bg-maroon hover:text-cream";

  return (
    <Sheet label="Cart" from="right" className="bottom-0 right-0 top-0 flex w-[min(430px,100vw)] flex-col">
      <div className="flex items-end justify-between px-6 pb-4 pt-6">
        <h2 className="t-h2">Cart</h2>
        <CloseButton autoFocus />
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center gap-3 px-6 pb-16">
          <p className="t-large">Your cart is empty.</p>
          <p className="t-body max-w-[20rem]">
            Hand-patched, one-of-a-kind pieces from the café community are waiting in the shop.
          </p>
          <LabelButton
            className="mt-1"
            onClick={() => {
              close();
              goTo("shop");
            }}
          >
            Browse merch
          </LabelButton>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-4 border-t border-maroon/15 py-4">
                <img
                  src={cdn(product.photo.src, 300)}
                  alt=""
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="t-h4">{product.title}</p>
                  <p className="t-note mt-1">
                    {money(product.price)}
                    {product.variant ? ` · ${product.variant}` : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      className={step}
                      aria-label={`Remove one ${product.title}`}
                      onClick={() => setQty(product.id, qty - 1)}
                    >
                      −
                    </button>
                    <span className="t-price w-4 text-center" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      className={step}
                      aria-label={`Add one ${product.title}`}
                      onClick={() => setQty(product.id, qty + 1)}
                    >
                      +
                    </button>
                    <button type="button" className="t-tiny link-line ml-auto" onClick={() => setQty(product.id, 0)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-maroon/25 px-6 pb-6 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="t-h4">Subtotal</span>
              <span className="t-price">{money(subtotal)}</span>
            </div>
            <LabelLink href={MERCH.cta.href} className="mt-4 block w-full py-[6px] text-center">
              Checkout
            </LabelLink>
            <p className="t-note mt-2 opacity-80">Checkout is completed on florawellnesscafe.com.</p>
          </div>
        </>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile menu                                                        */
/* ------------------------------------------------------------------ */
function MobileMenu() {
  const { close, open } = useUI();
  const { goTo } = useEngine();
  const link = "t-h1 block py-[5px] text-[2.5rem]";

  return (
    <Sheet label="Menu" from="top" className="inset-0 flex flex-col overflow-y-auto">
      <div className="px-gutter flex h-[var(--nav-h)] shrink-0 items-center justify-between">
        <span className="t-tiny">{BRAND.name}</span>
        <CloseButton autoFocus />
      </div>

      <motion.ul
        className="px-gutter flex flex-1 flex-col justify-center"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
      >
        {NAV.map((item) => (
          <motion.li
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 26 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
            }}
          >
            {item.frame ? (
              <a
                href={`#${item.frame}`}
                className={link}
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  goTo(item.frame as string);
                }}
              >
                {item.label}
              </a>
            ) : (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className={link}>
                {item.label} <span className="not-italic">↗</span>
              </a>
            )}
          </motion.li>
        ))}
      </motion.ul>

      <div className="px-gutter shrink-0 pb-8">
        <div className="flex gap-3">
          <LabelButton onClick={() => open("search")}>Search</LabelButton>
          <LabelButton onClick={() => open("cart")}>Cart</LabelButton>
        </div>
        <p className="t-note mt-4 opacity-90">
          {FOOTER.contact[1]}
          <br />
          {FOOTER.contact[2]}
        </p>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
export function Panels() {
  const { panel, close } = useUI();
  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          key="scrim"
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-50 bg-maroon/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      )}
      {panel === "search" && <SearchPanel key="search" />}
      {panel === "cart" && <CartPanel key="cart" />}
      {panel === "menu" && <MobileMenu key="menu" />}
    </AnimatePresence>
  );
}
