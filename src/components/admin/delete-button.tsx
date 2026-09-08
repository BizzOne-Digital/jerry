"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
  endpoint: string;
  redirectTo: string;
  label?: string;
}

export function DeleteButton({ endpoint, redirectTo, label = "Delete" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to ${label.toLowerCase()}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      router.push(redirectTo);
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="admin-btn admin-btn-danger"
    >
      {loading ? "Deleting..." : label}
    </button>
  );
}
