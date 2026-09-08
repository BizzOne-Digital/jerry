import type { CartItem } from "@/types";

export const CART_STORAGE_KEY = "sodapops-cart";

function toNumber(value: unknown, fallback = 0): number {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  const items: CartItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Partial<CartItem>;
    const productId = typeof item.productId === "string" ? item.productId : "";
    const slug = typeof item.slug === "string" ? item.slug : "";
    const name = typeof item.name === "string" ? item.name : "";
    const price = toNumber(item.price);
    const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)));

    if (!productId || !slug || !name || price <= 0) continue;

    items.push({
      productId,
      slug,
      name,
      price,
      quantity,
      ...(typeof item.image === "string" ? { image: item.image } : {}),
      ...(typeof item.variantId === "string" ? { variantId: item.variantId } : {}),
      ...(typeof item.variantName === "string" ? { variantName: item.variantName } : {}),
      ...(typeof item.sku === "string" ? { sku: item.sku } : {}),
    });
  }

  return items;
}

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
