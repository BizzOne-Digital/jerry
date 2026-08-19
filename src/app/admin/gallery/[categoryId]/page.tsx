"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";

interface MediaAsset {
  _id: string;
  originalName: string;
  publicUrl: string;
  altText?: string;
  byteSize: number;
  width?: number;
  height?: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminGalleryCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const [catRes, assetsRes] = await Promise.all([
        fetch(`/api/admin/gallery/categories/${categoryId}`),
        fetch(`/api/admin/gallery/assets?categoryId=${categoryId}`),
      ]);
      const catData = await catRes.json();
      const assetsData = await assetsRes.json();
      if (cancelled) return;
      if (catRes.ok) setCategory(catData);
      if (assetsRes.ok) setAssets(assetsData.items ?? []);
      setLoading(false);
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("categoryId", categoryId);

    try {
      const res = await fetch("/api/admin/gallery/assets", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed");
        return;
      }
      toast.success("Uploaded");
      setAssets((prev) => [data, ...prev]);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(assetId: string) {
    if (!confirm("Delete this asset?")) return;
    const res = await fetch(`/api/admin/gallery/assets/${assetId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Delete failed");
      return;
    }
    toast.success("Deleted");
    setAssets((prev) => prev.filter((a) => a._id !== assetId));
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;

  return (
    <div>
      <PageHeader
        title={category?.name ?? "Gallery"}
        description="Upload and manage media assets"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/gallery" className="admin-btn admin-btn-secondary text-sm">
              Back
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn-primary text-sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        }
      />

      {assets.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">No assets in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {assets.map((asset) => (
            <div key={asset._id} className="admin-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.publicUrl}
                alt={asset.altText ?? asset.originalName}
                className="aspect-square w-full object-cover"
              />
              <div className="p-2">
                <p className="truncate text-xs text-[var(--admin-muted)]">{asset.originalName}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(asset._id)}
                  className="mt-1 text-xs text-[var(--admin-danger)] hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
