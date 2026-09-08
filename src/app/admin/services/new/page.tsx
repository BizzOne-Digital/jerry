"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { LocalImageField } from "@/components/admin/local-image-field";
import { Tabs } from "@/components/admin/tabs";
import { CONTENT_STATUS } from "@/types";

const serviceSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, "Description required"),
  sortOrder: z.number(),
  status: z.enum(CONTENT_STATUS),
  ctaLabel: z.string().optional(),
  overview: z.string().optional(),
  benefitsText: z.string().optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function NewServicePage() {
  const router = useRouter();
  const [tab, setTab] = useState("card");
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const methods = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { status: "draft", sortOrder: 0, ctaLabel: "Learn More" },
  });

  async function onSubmit(values: ServiceForm) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          cardImage: cardImageUrl ? { url: cardImageUrl } : null,
          benefits: values.benefitsText?.split("\n").filter(Boolean) ?? [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Create failed");
        return;
      }
      toast.success("Service created");
      router.push(`/admin/services/${data._id}`);
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New Service"
        actions={
          <Link href="/admin/services" className="admin-btn admin-btn-secondary text-sm">
            Back
          </Link>
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
              <FormInput name="slug" label="Slug (optional)" />
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
                <LocalImageField
                  value={cardImageUrl}
                  onChange={setCardImageUrl}
                  folder="pages"
                  label="Card Image"
                />
              </div>
            </div>
          )}

          {tab === "detail" && (
            <div className="admin-card grid gap-4 p-6">
              <FormTextarea name="overview" label="Overview" rows={6} />
              <FormTextarea
                name="benefitsText"
                label="Benefits (one per line)"
                rows={4}
                placeholder="Benefit 1&#10;Benefit 2"
              />
            </div>
          )}

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Creating..." : "Create Service"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
