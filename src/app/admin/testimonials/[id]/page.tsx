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

const schema = z.object({
  customerName: z.string().min(1),
  title: z.string().optional(),
  location: z.string().optional(),
  text: z.string().min(1),
  rating: z.coerce.number().min(1).max(5).optional(),
  sortOrder: z.coerce.number(),
  status: z.enum(CONTENT_STATUS),
  featured: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AdminTestimonialEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft", sortOrder: 0, featured: false },
  });

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const res = await fetch(`/api/admin/testimonials/${id}`);
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
      const res = await fetch(isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${id}`, {
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
      if (isNew) router.push(`/admin/testimonials/${data._id}`);
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
        title={isNew ? "New Testimonial" : "Edit Testimonial"}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/testimonials" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            {!isNew && (
              <DeleteButton endpoint={`/api/admin/testimonials/${id}`} redirectTo="/admin/testimonials" />
            )}
          </div>
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card grid gap-4 p-6 md:grid-cols-2">
          <FormInput name="customerName" label="Customer Name" required />
          <FormInput name="title" label="Title / Role" />
          <FormInput name="location" label="Location" />
          <FormInput name="rating" label="Rating (1-5)" type="number" min={1} max={5} />
          <FormInput name="sortOrder" label="Sort Order" type="number" />
          <FormSelect
            name="status"
            label="Status"
            options={CONTENT_STATUS.map((s) => ({ value: s, label: s }))}
          />
          <FormCheckbox name="featured" label="Featured" />
          <div className="md:col-span-2">
            <FormTextarea name="text" label="Testimonial Text" rows={5} required />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? "Saving..." : isNew ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
