"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CheckoutForm() {
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { country: "US" } });

  const onSubmit = async (data: FormData) => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: data, notes: data.notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");
      clearCart();
      router.push(`/order/success?order=${json.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHydrated) return null;

  if (!items.length) {
    return (
      <Container>
        <p className="text-center text-arena-muted">Your cart is empty.</p>
      </Container>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 arena-glow rounded-sm bg-arena-surface p-6">
          <h2 className="font-display text-lg text-arena-gold">Shipping Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" {...register("firstName")} error={errors.firstName?.message} />
            <Input label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
          </div>
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Phone" type="tel" {...register("phone")} />
          <Input label="Address" {...register("line1")} error={errors.line1?.message} />
          <Input label="Apt / Suite" {...register("line2")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="City" {...register("city")} error={errors.city?.message} />
            <Input label="State" {...register("state")} error={errors.state?.message} />
            <Input label="ZIP" {...register("postalCode")} error={errors.postalCode?.message} />
          </div>
          <Textarea label="Order Notes" {...register("notes")} />
        </div>
        <div className="arena-glow h-fit rounded-sm bg-arena-surface p-6">
          <h2 className="font-display text-lg text-arena-gold">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-arena-muted">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-arena-border pt-4 font-display text-lg">
            <span>Subtotal</span>
            <span className="text-arena-gold">{formatCurrency(subtotal)}</span>
          </div>
          <Button type="submit" disabled={submitting} className="mt-6 w-full" size="lg">
            {submitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </Container>
  );
}
