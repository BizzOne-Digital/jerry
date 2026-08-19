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
import { DeleteButton } from "@/components/admin/delete-button";
import { CONTENT_STATUS } from "@/types";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  authorName: z.string().optional(),
  category: z.string().optional(),
  body: z.string().min(1),
  status: z.enum(CONTENT_STATUS),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/blogs/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load");
        return;
      }
      methods.reset({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? "",
        authorName: data.authorName,
        category: data.category ?? "",
        body: data.body,
        status: data.status,
        seoTitle: data.seo?.title ?? "",
        seoDescription: data.seo?.description ?? "",
      });
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: FormData) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          seo: { title: values.seoTitle, description: values.seoDescription },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Post saved");
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
        title="Edit Blog Post"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/blogs" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <DeleteButton endpoint={`/api/admin/blogs/${id}`} redirectTo="/admin/blogs" />
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput name="title" label="Title" required />
            <FormInput name="slug" label="Slug" required />
            <FormInput name="authorName" label="Author" />
            <FormInput name="category" label="Category" />
            <FormSelect
              name="status"
              label="Status"
              options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <FormTextarea name="excerpt" label="Excerpt" rows={2} />
          <FormTextarea name="body" label="Body" rows={12} required />
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput name="seoTitle" label="SEO Title" />
            <FormTextarea name="seoDescription" label="SEO Description" rows={2} />
          </div>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Post"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
