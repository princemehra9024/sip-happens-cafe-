import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useEngine } from "@/engine/context";

/** App-level UI state: which overlay is open, the announcement bar, the cart. */

export type PanelName = "search" | "cart" | "menu";

interface UI {
  panel: PanelName | null;
  open: (panel: PanelName) => void;
  close: () => void;
  annOpen: boolean;
  closeAnn: () => void;
  cart: Record<string, number>;
  cartCount: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}

const UIContext = createContext<UI | null>(null);

export function useUI(): UI {
  const ui = useContext(UIContext);
  if (!ui) throw new Error("useUI must be used inside <UIProvider>");
  return ui;
}

const MAX_QTY = 9;

export function UIProvider({ children }: { children: ReactNode }) {
  const { lock } = useEngine();
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [annOpen, setAnnOpen] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((next: PanelName) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    setPanel(null);
    opener.current?.focus({ preventScroll: true });
    opener.current = null;
  }, []);

  // While an overlay is open the frames must not react to scrolling
  useEffect(() => {
    lock(panel !== null);
  }, [lock, panel]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, close]);

  const add = useCallback(
    (id: string) => {
      setCart((c) => ({ ...c, [id]: Math.min(MAX_QTY, (c[id] ?? 0) + 1) }));
      open("cart");
    },
    [open],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(MAX_QTY, qty);
      return next;
    });
  }, []);

  const closeAnn = useCallback(() => setAnnOpen(false), []);

  const value = useMemo<UI>(
    () => ({
      panel,
      open,
      close,
      annOpen,
      closeAnn,
      cart,
      cartCount: Object.values(cart).reduce((sum, n) => sum + n, 0),
      add,
      setQty,
    }),
    [panel, open, close, annOpen, closeAnn, cart, add, setQty],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
