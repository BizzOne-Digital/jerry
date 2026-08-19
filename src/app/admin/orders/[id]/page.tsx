"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { ORDER_STATUSES, PAYMENT_STATUSES, FULFILLMENT_STATUSES } from "@/types";

const orderSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES),
  internalNotes: z.string().optional(),
  statusNote: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

interface OrderData {
  _id: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number; sku?: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  internalNotes?: string;
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const methods = useForm<OrderForm>({ resolver: zodResolver(orderSchema) });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load order");
        return;
      }
      setOrder(data);
      methods.reset({
        orderStatus: data.orderStatus,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        internalNotes: data.internalNotes ?? "",
      });
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: OrderForm) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        return;
      }
      setOrder(data);
      toast.success("Order updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        actions={
          <Link href="/admin/orders" className="admin-btn admin-btn-secondary text-sm">
            Back
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="admin-card p-4">
          <p className="text-sm text-[var(--admin-muted)]">Customer</p>
          <p className="mt-1 font-medium">
            {order.customer?.firstName} {order.customer?.lastName}
          </p>
          <p className="text-sm">{order.customer?.email}</p>
          <p className="text-sm">{order.customer?.phone}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-sm text-[var(--admin-muted)]">Total</p>
          <p className="mt-1 text-2xl font-bold text-[var(--admin-accent)]">
            ${order.total.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--admin-muted)]">
            Subtotal ${order.subtotal.toFixed(2)} + Ship ${order.shipping.toFixed(2)} + Tax $
            {order.tax.toFixed(2)}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="text-sm text-[var(--admin-muted)]">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
            <StatusBadge status={order.fulfillmentStatus} />
          </div>
        </div>
      </div>

      <div className="admin-card mb-6 overflow-hidden">
        <div className="border-b border-[var(--admin-border)] px-4 py-3">
          <h2 className="font-semibold">Line Items</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td className="font-mono text-sm">{item.sku ?? "—"}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <h2 className="font-semibold">Update Order</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <FormSelect
              name="orderStatus"
              label="Order Status"
              options={ORDER_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
            />
            <FormSelect
              name="paymentStatus"
              label="Payment Status"
              options={PAYMENT_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
            />
            <FormSelect
              name="fulfillmentStatus"
              label="Fulfillment Status"
              options={FULFILLMENT_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <FormTextarea name="statusNote" label="Status Change Note" rows={2} />
          <FormTextarea name="internalNotes" label="Internal Notes" rows={3} />
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Update Order"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
