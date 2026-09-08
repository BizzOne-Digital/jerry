"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from "@/components/admin/form-fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { DeleteButton } from "@/components/admin/delete-button";
import { CONTENT_STATUS, PRODUCT_CATEGORIES } from "@/types";
import type { ImageRef } from "@/types";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
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
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [primaryImage, setPrimaryImage] = useState<ImageRef | null>(null);

  const methods = useForm<ProductForm>({ resolver: zodResolver(productSchema) });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load product");
        return;
      }
      methods.reset({
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        category: data.category,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        shortDescription: data.shortDescription ?? "",
        longDescription: data.longDescription ?? "",
        status: data.status,
        featured: data.featured ?? false,
        onSale: data.onSale ?? false,
        seoTitle: data.seo?.title ?? "",
        seoDescription: data.seo?.description ?? "",
      });
      setPrimaryImage(data.images?.[0] ?? null);
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: ProductForm) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: primaryImage ? [primaryImage] : [],
          seo: { title: values.seoTitle, description: values.seoDescription },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Product saved");
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
        title="Edit Product"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/products" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <DeleteButton endpoint={`/api/admin/products/${id}`} redirectTo="/admin/products" />
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
            <FormInput name="name" label="Name" required />
            <FormInput name="slug" label="Slug" required />
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
              <MediaPicker value={primaryImage} onChange={setPrimaryImage} label="Primary Image" />
            </div>
            <div className="md:col-span-2">
              <FormTextarea name="shortDescription" label="Short Description" />
            </div>
            <div className="md:col-span-2">
              <FormTextarea name="longDescription" label="Long Description" rows={6} />
            </div>
            <FormInput name="seoTitle" label="SEO Title" />
            <FormTextarea name="seoDescription" label="SEO Description" rows={2} />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
