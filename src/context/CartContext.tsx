"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { CART_STORAGE_KEY, calculateCartSubtotal } from "@/lib/commerce/utils";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored && !cancelled) setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        /* ignore corrupt storage */
      }
      if (!cancelled) setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.variantId);
      const idx = prev.findIndex((i) => itemKey(i.productId, i.variantId) === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    const key = itemKey(productId, variantId);
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.variantId) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) return;
    const key = itemKey(productId, variantId);
    setItems((prev) =>
      prev.map((i) => (itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: calculateCartSubtotal(items),
      isHydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, isHydrated, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
