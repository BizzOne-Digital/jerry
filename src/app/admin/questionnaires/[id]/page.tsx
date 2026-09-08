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
import { QUESTIONNAIRE_STATUSES } from "@/types";

const schema = z.object({
  status: z.enum(QUESTIONNAIRE_STATUSES),
  internalNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Questionnaire {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  favoriteSports?: string[];
  favoriteTeams?: string[];
  favoritePlayers?: string[];
  itemsToCollect?: string[];
  collectingGoals?: string;
  budgetRange?: string;
  additionalNotes?: string;
  orderId?: string;
  orderNumber?: string;
  status: string;
  internalNotes?: string;
  createdAt: string;
}

function ListField({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-sm text-[var(--admin-muted)]">{label}</p>
      <p className="mt-1">{items.join(", ")}</p>
    </div>
  );
}

export default function AdminQuestionnaireDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/questionnaires/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load");
        return;
      }
      setQuestionnaire(data);
      methods.reset({ status: data.status, internalNotes: data.internalNotes ?? "" });
      setLoading(false);
    }
    void load();
  }, [id, methods]);

  async function onSubmit(values: FormData) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/questionnaires/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        return;
      }
      setQuestionnaire(data);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;
  if (!questionnaire) return <p>Questionnaire not found</p>;

  return (
    <div>
      <PageHeader
        title={`Profile: ${questionnaire.name}`}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/questionnaires" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <DeleteButton endpoint={`/api/admin/questionnaires/${id}`} redirectTo="/admin/questionnaires" />
          </div>
        }
      />

      <div className="admin-card mb-6 space-y-4 p-6">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Email</p>
            <p>{questionnaire.email}</p>
          </div>
          {questionnaire.phone && (
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Phone</p>
              <p>{questionnaire.phone}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Status</p>
            <StatusBadge status={questionnaire.status} />
          </div>
          {questionnaire.orderNumber && (
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Linked Order</p>
              {questionnaire.orderId ? (
                <Link
                  href={`/admin/orders/${questionnaire.orderId}`}
                  className="font-mono text-[var(--admin-accent)] hover:underline"
                >
                  {questionnaire.orderNumber}
                </Link>
              ) : (
                <p className="font-mono">{questionnaire.orderNumber}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListField label="Favorite Sports" items={questionnaire.favoriteSports} />
          <ListField label="Items to Collect" items={questionnaire.itemsToCollect} />
          <ListField label="Favorite Teams" items={questionnaire.favoriteTeams} />
          <ListField label="Favorite Players" items={questionnaire.favoritePlayers} />
        </div>

        {questionnaire.budgetRange && (
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Budget Range</p>
            <p>{questionnaire.budgetRange}</p>
          </div>
        )}

        {questionnaire.collectingGoals && (
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Collecting Goals</p>
            <p className="mt-1 whitespace-pre-wrap">{questionnaire.collectingGoals}</p>
          </div>
        )}

        {questionnaire.additionalNotes && (
          <div>
            <p className="text-sm text-[var(--admin-muted)]">Additional Notes</p>
            <p className="mt-1 whitespace-pre-wrap">{questionnaire.additionalNotes}</p>
          </div>
        )}

        <p className="text-xs text-[var(--admin-muted)]">
          Submitted {new Date(questionnaire.createdAt).toLocaleString()}
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="admin-card space-y-4 p-6">
          <FormSelect
            name="status"
            label="Status"
            options={QUESTIONNAIRE_STATUSES.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            }))}
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
