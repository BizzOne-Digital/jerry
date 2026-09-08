"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { deleteStoredUploadByUrl } from "@/lib/media/stored-uploads-client";
import type { UploadFolder } from "@/types";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

interface LocalImageFieldProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  label?: string;
}

export function LocalImageField({ value, onChange, folder, label = "Image" }: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(file: File) {
    setUploading(true);
    try {
      if (value?.startsWith("/api/uploads/")) {
        await deleteStoredUploadByUrl(value);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (value?.startsWith("/api/uploads/")) {
      await deleteStoredUploadByUrl(value);
    }
    onChange(null);
    toast.success("Image removed");
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-[var(--admin-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
            No image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFileSelect(file);
            }}
          />
          <button
            type="button"
            className="admin-btn admin-btn-secondary text-sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading..." : value ? "Replace" : "Upload Image"}
          </button>
          {value && (
            <button
              type="button"
              className="admin-btn admin-btn-danger text-sm"
              disabled={uploading}
              onClick={() => void handleRemove()}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
