"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { PageSectionEditor } from "@/components/admin/page-section-editor";
import { FormInput, FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { LocalImageField } from "@/components/admin/local-image-field";
import { CONTENT_STATUS } from "@/types";
import type { PageSection } from "@/types";

const pageSchema = z.object({
  title: z.string().min(1),
  status: z.enum(CONTENT_STATUS),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type PageForm = z.infer<typeof pageSchema>;

export default function AdminPageEditorPage() {
  const params = useParams();
  const key = params.key as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);

  const methods = useForm<PageForm>({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: "", status: "published" },
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/pages/${key}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to load page");
        return;
      }
      methods.reset({
        title: data.title,
        status: data.status,
        seoTitle: data.seo?.title ?? "",
        seoDescription: data.seo?.description ?? "",
      });
      setSections(data.sections ?? []);
      setOgImageUrl(data.seo?.ogImage?.url ?? null);
      setLoading(false);
    }
    void load();
  }, [key, methods]);

  async function onSubmit(values: PageForm) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          status: values.status,
          sections,
          seo: {
            title: values.seoTitle,
            description: values.seoDescription,
            ogImage: ogImageUrl ? { url: ogImageUrl } : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Page saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-[var(--admin-muted)]">Loading...</p>;
  }

  return (
    <div>
      <PageHeader
        title={`Edit Page: ${key}`}
        description="Update each section below — no JSON editing required."
        actions={
          <Link href="/admin/pages" className="admin-btn admin-btn-secondary text-sm">
            Back
          </Link>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
            <FormInput name="title" label="Page Title" required />
            <FormSelect
              name="status"
              label="Status"
              options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
            />
          </div>

          <div className="admin-card space-y-4 p-6">
            <h2 className="font-semibold">Page Sections</h2>
            <p className="text-sm text-[var(--admin-muted)]">
              Click a section to expand it. Edit headings, text, buttons, and images for each block on this page.
            </p>
            <PageSectionEditor sections={sections} onChange={setSections} />
          </div>

          <div className="admin-card space-y-4 p-6">
            <h2 className="font-semibold">SEO</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput name="seoTitle" label="SEO Title" />
              <FormTextarea name="seoDescription" label="SEO Description" rows={2} />
            </div>
            <LocalImageField
              label="Social Share Image (optional)"
              folder="pages"
              value={ogImageUrl}
              onChange={setOgImageUrl}
            />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Page"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
