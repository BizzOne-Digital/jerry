import type { CartItem } from "@/types";

export const CART_STORAGE_KEY = "sodapops-cart";

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateOrderTotals(items: CartItem[], shipping = 0, tax = 0) {
  const subtotal = calculateCartSubtotal(items);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SP-${y}${m}${d}-${rand}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
