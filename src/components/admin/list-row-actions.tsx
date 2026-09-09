"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ListRowActionsProps {
  editHref: string;
  deleteEndpoint: string;
  itemLabel?: string;
}

export function ListRowActions({ editHref, deleteEndpoint, itemLabel = "item" }: ListRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete this ${itemLabel}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(deleteEndpoint, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Delete failed");
        return;
      }
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={editHref} className="text-sm text-[var(--admin-accent)] hover:underline">
        Edit
      </Link>
      <button
        type="button"
        onClick={() => void handleDelete()}
        disabled={loading}
        className="text-sm text-red-400 hover:underline disabled:opacity-50"
      >
        {loading ? "..." : "Delete"}
      </button>
    </div>
  );
}
