"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { DeleteButton } from "@/components/admin/delete-button";
import { CONTENT_STATUS, FAQ_CATEGORIES } from "@/types";

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.enum(FAQ_CATEGORIES),
  sortOrder: z.coerce.number(),
  status: z.enum(CONTENT_STATUS),
});

type FormData = z.infer<typeof schema>;

export default function AdminFaqEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "General", status: "draft", sortOrder: 0 },
  });

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const res = await fetch(`/api/admin/faqs/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load");
        return;
      }
      methods.reset(data);
      setLoading(false);
    }
    void load();
  }, [id, isNew, methods]);

  async function onSubmit(values: FormData) {
    setSaving(true);
    try {
      const res = await fetch(isNew ? "/api/admin/faqs" : `/api/admin/faqs/${id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success(isNew ? "Created" : "Saved");
      if (isNew) router.push(`/admin/faqs/${data._id}`);
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
        title={isNew ? "New FAQ" : "Edit FAQ"}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/faqs" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            {!isNew && <DeleteButton endpoint={`/api/admin/faqs/${id}`} redirectTo="/admin/faqs" />}
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <FormInput name="question" label="Question" required />
          <FormTextarea name="answer" label="Answer" rows={6} required />
          <div className="grid gap-4 md:grid-cols-3">
            <FormSelect
              name="category"
              label="Category"
              options={FAQ_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <FormInput name="sortOrder" label="Sort Order" type="number" />
            <FormSelect
              name="status"
              label="Status"
              options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : isNew ? "Create" : "Save"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
