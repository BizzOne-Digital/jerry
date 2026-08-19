"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { Tabs } from "@/components/admin/tabs";
import { DeleteButton } from "@/components/admin/delete-button";
import { CONTENT_STATUS } from "@/types";
import type { ImageRef } from "@/types";

const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  sortOrder: z.coerce.number(),
  status: z.enum(CONTENT_STATUS),
  ctaLabel: z.string().optional(),
  overview: z.string().optional(),
  benefitsText: z.string().optional(),
  detailHeroHeading: z.string().optional(),
  detailHeroSubheading: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function EditServicePage() {
  const params = useParams();
  const id = params.id as string;
  const [tab, setTab] = useState("card");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cardImage, setCardImage] = useState<ImageRef | null>(null);
  const [detailHeroImage, setDetailHeroImage] = useState<ImageRef | null>(null);

  const methods = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/services/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load service");
        return;
      }
      methods.reset({
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        sortOrder: data.sortOrder ?? 0,
        status: data.status,
        ctaLabel: data.ctaLabel,
        overview: data.overview ?? "",
        benefitsText: (data.benefits ?? []).join("\n"),
        detailHeroHeading: data.detailHero?.heading ?? "",
        detailHeroSubheading: data.detailHero?.subheading ?? "",
        seoTitle: data.seo?.title ?? "",
        seoDescription: data.seo?.description ?? "",
      });
      setCardImage(data.cardImage ?? null);
      setDetailHeroImage(data.detailHero?.image ?? null);
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: ServiceForm) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          shortDescription: values.shortDescription,
          sortOrder: values.sortOrder,
          status: values.status,
          ctaLabel: values.ctaLabel,
          cardImage,
          overview: values.overview,
          benefits: values.benefitsText?.split("\n").filter(Boolean) ?? [],
          detailHero: {
            heading: values.detailHeroHeading,
            subheading: values.detailHeroSubheading,
            image: detailHeroImage,
          },
          seo: { title: values.seoTitle, description: values.seoDescription },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Service saved");
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
        title="Edit Service"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/services" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <DeleteButton endpoint={`/api/admin/services/${id}`} redirectTo="/admin/services" />
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: "card", label: "Card / Description" },
          { id: "detail", label: "Detail Page" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {tab === "card" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormInput name="title" label="Title" required />
              <FormInput name="slug" label="Slug" required />
              <div className="md:col-span-2">
                <FormTextarea name="shortDescription" label="Short Description" required />
              </div>
              <FormInput name="sortOrder" label="Sort Order" type="number" />
              <FormSelect
                name="status"
                label="Status"
                options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
              />
              <FormInput name="ctaLabel" label="CTA Label" />
              <div className="md:col-span-2">
                <MediaPicker value={cardImage} onChange={setCardImage} label="Card Image" />
              </div>
            </div>
          )}

          {tab === "detail" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormInput name="detailHeroHeading" label="Hero Heading" />
              <FormInput name="detailHeroSubheading" label="Hero Subheading" />
              <div className="md:col-span-2">
                <MediaPicker value={detailHeroImage} onChange={setDetailHeroImage} label="Hero Image" />
              </div>
              <div className="md:col-span-2">
                <FormTextarea name="overview" label="Overview" rows={6} />
              </div>
              <FormTextarea name="benefitsText" label="Benefits (one per line)" rows={4} />
              <FormInput name="seoTitle" label="SEO Title" />
              <FormTextarea name="seoDescription" label="SEO Description" rows={2} />
            </div>
          )}

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Service"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
