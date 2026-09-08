"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/delete-button";
import { CONTENT_STATUS } from "@/types";

const offerSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  price: z.coerce.number().min(0),
  summary: z.string().optional(),
  includedItemsText: z.string().optional(),
  inventory: z.coerce.number().min(0),
  availability: z.enum(["available", "limited", "sold_out"]),
  sortOrder: z.coerce.number(),
  status: z.enum(CONTENT_STATUS),
  featured: z.boolean().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

type OfferForm = z.infer<typeof offerSchema>;

export default function AdminOfferEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const methods = useForm<OfferForm>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      status: "draft",
      availability: "available",
      inventory: 0,
      sortOrder: 0,
      ctaLabel: "Request Package",
      ctaHref: "/contact?inquiry=Buy",
    },
  });

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const res = await fetch(`/api/admin/offers/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load offer");
        return;
      }
      methods.reset({
        name: data.name,
        slug: data.slug,
        price: data.price,
        summary: data.summary ?? "",
        includedItemsText: (data.includedItems ?? []).join("\n"),
        inventory: data.inventory ?? 0,
        availability: data.availability,
        sortOrder: data.sortOrder ?? 0,
        status: data.status,
        featured: data.featured ?? false,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
      });
      setLoading(false);
    }
    void load();
  }, [id, isNew, methods]);

  async function onSubmit(values: OfferForm) {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        price: values.price,
        summary: values.summary,
        includedItems: values.includedItemsText?.split("\n").filter(Boolean) ?? [],
        inventory: values.inventory,
        availability: values.availability,
        sortOrder: values.sortOrder,
        status: values.status,
        featured: values.featured,
        ctaLabel: values.ctaLabel,
        ctaHref: values.ctaHref,
      };

      const res = await fetch(isNew ? "/api/admin/offers" : `/api/admin/offers/${id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success(isNew ? "Offer created" : "Offer saved");
      if (isNew) router.push(`/admin/offers/${data._id}`);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;

  return (
    <div>
      <PageHeader
        title={isNew ? "New Offer" : "Edit Offer"}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/offers" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            {!isNew && (
              <DeleteButton endpoint={`/api/admin/offers/${id}`} redirectTo="/admin/offers" />
            )}
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
            <FormInput name="name" label="Name" required />
            <FormInput name="slug" label="Slug (optional)" />
            <FormInput name="price" label="Price" type="number" step="0.01" required />
            <FormInput name="inventory" label="Inventory" type="number" />
            <FormSelect
              name="availability"
              label="Availability"
              options={[
                { value: "available", label: "Available" },
                { value: "limited", label: "Limited" },
                { value: "sold_out", label: "Sold Out" },
              ]}
            />
            <FormSelect
              name="status"
              label="Status"
              options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
            />
            <FormInput name="sortOrder" label="Sort Order" type="number" />
            <FormCheckbox name="featured" label="Featured" />
            <div className="md:col-span-2">
              <FormTextarea name="summary" label="Summary" />
            </div>
            <div className="md:col-span-2">
              <FormTextarea name="includedItemsText" label="Included Items (one per line)" rows={4} />
            </div>
            <FormInput name="ctaLabel" label="CTA Label" />
            <FormInput name="ctaHref" label="CTA Link" />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : isNew ? "Create Offer" : "Save Offer"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
