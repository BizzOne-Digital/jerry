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
import { CONTENT_STATUS } from "@/types";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  authorName: z.string().optional(),
  category: z.string().optional(),
  body: z.string().min(1),
  status: z.enum(CONTENT_STATUS),
});

type FormData = z.infer<typeof schema>;

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft", authorName: "Sodapops Team" },
  });

  async function onSubmit(values: FormData) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Create failed");
        return;
      }
      toast.success("Post created");
      router.push(`/admin/blogs/${data._id}`);
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="New Blog Post"
        actions={
          <Link href="/admin/blogs" className="admin-btn admin-btn-secondary text-sm">
            Back
          </Link>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput name="title" label="Title" required />
            <FormInput name="slug" label="Slug (optional)" />
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
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Creating..." : "Create Post"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
