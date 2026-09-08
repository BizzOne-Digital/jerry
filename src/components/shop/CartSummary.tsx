"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { BrandImage } from "@/components/ui/BrandImage";
import { BRAND_IMAGES } from "@/lib/images";

function cartItemKey(item: { productId: string; variantId?: string }) {
  return item.variantId ? `${item.productId}:${item.variantId}` : item.productId;
}

export function CartSummary() {
  const { items, subtotal, removeItem, updateQuantity, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-12 text-center" aria-busy="true" aria-live="polite">
        <p className="text-arena-muted">Loading your cart...</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-arena-muted">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center justify-center rounded-sm border border-arena-gold/40 px-7 py-3.5 font-display text-base tracking-wider text-arena-gold transition-colors hover:bg-arena-gold/10"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const key = cartItemKey(item);
        const imageSrc = item.image || BRAND_IMAGES.cards;

        return (
          <div key={key} className="flex gap-4 rounded-sm border border-arena-border bg-arena-surface p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
              <BrandImage
                src={imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/shop/${item.slug}`}
                className="font-display text-sm text-arena-cream hover:text-arena-gold"
              >
                {item.name}
              </Link>
              {item.variantName && <p className="text-xs text-arena-muted">{item.variantName}</p>}
              <p className="mt-1 text-arena-gold">{formatCurrency(item.price)}</p>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-arena-muted">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, parseInt(e.target.value, 10) || 1, item.variantId)
                    }
                    className="w-14 rounded-sm border border-arena-border bg-arena-navy px-2 py-1 text-arena-cream"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-xs text-arena-coral hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="border-t border-arena-border pt-4">
        <div className="flex justify-between font-display text-lg">
          <span>Subtotal</span>
          <span className="text-arena-gold">{formatCurrency(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex w-full items-center justify-center rounded-sm bg-arena-gold px-7 py-3.5 font-display text-base tracking-wider text-arena-black transition-colors hover:bg-arena-gold-bright"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
