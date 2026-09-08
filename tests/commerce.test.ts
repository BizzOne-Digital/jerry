import { describe, expect, it } from "vitest";
import { calculateCartSubtotal, calculateOrderTotals, generateOrderNumber, slugify } from "@/lib/commerce/utils";
import type { CartItem } from "@/types";

describe("commerce utils", () => {
  const items: CartItem[] = [
    { productId: "1", slug: "test", name: "Test", price: 25, quantity: 2 },
    { productId: "2", slug: "test-2", name: "Test 2", price: 10, quantity: 1 },
  ];

  it("calculates cart subtotal", () => {
    expect(calculateCartSubtotal(items)).toBe(60);
  });

  it("calculates order totals", () => {
    const totals = calculateOrderTotals(items, 5, 2);
    expect(totals.subtotal).toBe(60);
    expect(totals.total).toBe(67);
  });

  it("generates order numbers with SP prefix", () => {
    expect(generateOrderNumber()).toMatch(/^SP-/);
  });

  it("slugifies strings", () => {
    expect(slugify("Buy Collectible Cards!")).toBe("buy-collectible-cards");
  });
});
