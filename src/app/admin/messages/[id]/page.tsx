"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormSelect, FormTextarea } from "@/components/admin/form-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";

const schema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"]),
  internalNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  referencedService?: string;
  referencedProduct?: string;
  message: string;
  status: string;
  internalNotes?: string;
  createdAt: string;
}

export default function AdminMessageDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/messages/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load");
        return;
      }
      setMessage(data);
      methods.reset({ status: data.status, internalNotes: data.internalNotes ?? "" });
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: FormData) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        return;
      }
      setMessage(data);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;
  if (!message) return <p>Message not found</p>;

  return (
    <div>
      <PageHeader
        title={`Message from ${message.name}`}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/messages" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <DeleteButton endpoint={`/api/admin/messages/${id}`} redirectTo="/admin/messages" />
          </div>
        }
      />

      <div className="admin-card mb-6 space-y-3 p-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Email</p>
            <p>{message.email}</p>
          </div>
          {message.phone && (
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Phone</p>
              <p>{message.phone}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Inquiry Type</p>
            <p>{message.inquiryType}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Status</p>
            <StatusBadge status={message.status} />
          </div>
        </div>
        <div>
          <p className="text-sm text-[var(--admin-muted)]">Message</p>
          <p className="mt-1 whitespace-pre-wrap">{message.message}</p>
        </div>
        <p className="text-xs text-[var(--admin-muted)]">
          Received {new Date(message.createdAt).toLocaleString()}
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <FormSelect
            name="status"
            label="Status"
            options={[
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
              { value: "replied", label: "Replied" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <FormTextarea name="internalNotes" label="Internal Notes" rows={4} />
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Update"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
