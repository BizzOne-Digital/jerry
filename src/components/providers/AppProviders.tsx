"use client";

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            color: "#f5f0e8",
            border: "1px solid rgba(212,175,55,0.25)",
          },
        }}
      />
    </CartProvider>
  );
}
