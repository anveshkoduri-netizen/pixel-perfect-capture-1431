import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { productById, products, type Product } from "./skycart-data";

export type CartLine = { id: string; qty: number };

type CartState = {
  lines: CartLine[];
  saved: string[];
  wishlist: string[];
  recentlyViewed: string[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  markViewed: (id: string) => void;
  clear: () => void;
  count: number;
  detailed: Array<{ product: Product; qty: number }>;
  totals: { subtotal: number; mrpTotal: number; savings: number; delivery: number; allFree: boolean; gstIncluded: number; total: number };
};

// Keep one context instance across hot reloads so the provider and hooks always match.
const globalForCart = globalThis as unknown as { __skycartCartContext?: React.Context<CartState | null> };
const CartContext = (globalForCart.__skycartCartContext ??= createContext<CartState | null>(null));

const STORAGE_KEY = "skycart.cart.v1";
/** Per-line delivery charge for products without free delivery; shown on cards, PDP and cart lines. */
export const DELIVERY_FEE = 99;

const seedLines: CartLine[] = [
  { id: "polycab-2-5-fr-wire", qty: 2 },
  { id: "havells-32a-mcb", qty: 4 },
  { id: "philips-20w-batten", qty: 6 },
  { id: "astral-pvc-fitting-set", qty: 1 },
  { id: "honeywell-nitrile-gloves", qty: 1 },
  { id: "stanley-65pc-kit", qty: 1 },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(seedLines);
  const [saved, setSaved] = useState<string[]>(["makita-ga5030-grinder"]);
  const [wishlist, setWishlist] = useState<string[]>(["bosch-gbh-2-26"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
    "bosch-gsb-18v-50",
    "philips-20w-batten",
    "skf-6205-bearing",
    "godrej-ultra-lock",
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.lines)) setLines(parsed.lines);
      if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
      if (Array.isArray(parsed.wishlist)) setWishlist(parsed.wishlist);
      if (Array.isArray(parsed.recentlyViewed)) setRecentlyViewed(parsed.recentlyViewed);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, saved, wishlist, recentlyViewed }));
    } catch {
      /* storage unavailable */
    }
  }, [lines, saved, wishlist, recentlyViewed]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);

  const saveForLater = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
    setSaved((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const moveToCart = useCallback((id: string) => {
    setSaved((prev) => prev.filter((x) => x !== id));
    add(id, 1);
  }, [add]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const markViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const product = productById(l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => Boolean(x)),
    [lines],
  );

  const totals = useMemo(() => {
    // Listed prices already include 18% GST.
    const subtotal = detailed.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const mrpTotal = detailed.reduce((sum, l) => sum + l.product.mrp * l.qty, 0);
    const paidLines = detailed.filter((l) => !l.product.freeDelivery);
    const delivery = paidLines.length * DELIVERY_FEE;
    const total = subtotal + delivery;
    return {
      subtotal,
      mrpTotal,
      savings: mrpTotal - subtotal,
      delivery,
      allFree: paidLines.length === 0,
      gstIncluded: Math.round((total * 18) / 118),
      total,
    };
  }, [detailed]);

  const value: CartState = {
    lines,
    saved,
    wishlist,
    recentlyViewed,
    add,
    setQty,
    remove,
    saveForLater,
    moveToCart,
    toggleWishlist,
    markViewed,
    clear,
    count: detailed.reduce((n, l) => n + l.qty, 0),
    detailed,
    totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export const recommendedProducts = products.filter((x) => x.tags.includes("recommended"));
