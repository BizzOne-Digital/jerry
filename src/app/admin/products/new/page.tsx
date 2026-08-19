"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from "@/components/admin/form-fields";
import { CONTENT_STATUS, PRODUCT_CATEGORIES } from "@/types";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  sku: z.string().min(1),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  status: z.enum(CONTENT_STATUS),
  featured: z.boolean().optional(),
  onSale: z.boolean().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const methods = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "draft", category: "Cards", stock: 0, featured: false, onSale: false },
  });

  async function onSubmit(values: ProductForm) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Create failed");
        return;
      }
      toast.success("Product created");
      router.push(`/admin/products/${data._id}`);
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New Product"
        actions={
          <Link href="/admin/products" className="admin-btn admin-btn-secondary text-sm">
            Back
          </Link>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
            <FormInput name="name" label="Name" required />
            <FormInput name="slug" label="Slug (optional)" />
            <FormInput name="sku" label="SKU" required />
            <FormSelect
              name="category"
              label="Category"
              options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <FormInput name="price" label="Price" type="number" step="0.01" required />
            <FormInput name="compareAtPrice" label="Compare At Price" type="number" step="0.01" />
            <FormInput name="stock" label="Stock" type="number" required />
            <FormSelect
              name="status"
              label="Status"
              options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
            />
            <FormCheckbox name="featured" label="Featured" />
            <FormCheckbox name="onSale" label="On Sale" />
            <div className="md:col-span-2">
              <FormTextarea name="shortDescription" label="Short Description" />
            </div>
            <div className="md:col-span-2">
              <FormTextarea name="longDescription" label="Long Description" rows={6} />
            </div>
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Creating..." : "Create Product"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
