"use client";

import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import type { CartItem } from "@/types";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity"> & { quantity?: number };
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleClick = () => {
    addItem({ ...item, quantity: item.quantity ?? 1 });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <Button onClick={handleClick} disabled={disabled} className="w-full" size="lg">
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
