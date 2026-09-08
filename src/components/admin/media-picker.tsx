"use client";

import { useState } from "react";
import type { ImageRef } from "@/types";

interface MediaPickerProps {
  value?: ImageRef | null;
  onChange: (value: ImageRef | null) => void;
  label?: string;
}

interface MediaAsset {
  _id: string;
  publicUrl: string;
  altText?: string;
  originalName: string;
}

export function MediaPicker({ value, onChange, label = "Image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAssets() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery/assets?limit=50");
    const data = await res.json();
    setAssets(data.items ?? []);
    setLoading(false);
  }

  function handleOpen() {
    setOpen(true);
    void loadAssets();
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex items-start gap-4">
        {value?.url ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-[var(--admin-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.url} alt={value.alt ?? ""} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
            No image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button type="button" className="admin-btn admin-btn-secondary text-sm" onClick={handleOpen}>
            Choose Image
          </button>
          {value?.url && (
            <button
              type="button"
              className="admin-btn admin-btn-danger text-sm"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden />
          <div className="admin-card relative z-10 max-h-[80vh] w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-4 py-3">
              <h3 className="font-semibold">Media Library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-[var(--admin-muted)] hover:text-white">
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-sm text-[var(--admin-muted)]">Loading...</p>
              ) : assets.length === 0 ? (
                <p className="text-center text-sm text-[var(--admin-muted)]">
                  No media found. Upload images in Gallery.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {assets.map((asset) => (
                    <button
                      key={asset._id}
                      type="button"
                      className="overflow-hidden rounded-lg border border-[var(--admin-border)] transition hover:border-[var(--admin-accent)]"
                      onClick={() => {
                        onChange({
                          url: asset.publicUrl,
                          alt: asset.altText ?? asset.originalName,
                          mediaId: asset._id,
                        });
                        setOpen(false);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.publicUrl}
                        alt={asset.altText ?? asset.originalName}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
