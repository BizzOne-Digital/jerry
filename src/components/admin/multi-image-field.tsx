"use client";

import { LocalImageField } from "@/components/admin/local-image-field";
import { deleteStoredUploadByUrl } from "@/lib/media/stored-uploads-client";
import type { UploadFolder } from "@/types";

interface MultiImageFieldProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder: UploadFolder;
  label?: string;
  max?: number;
}

export function MultiImageField({
  values,
  onChange,
  folder,
  label = "Images",
  max = 6,
}: MultiImageFieldProps) {
  const slots = values.length < max ? [...values, null] : values;

  function updateAt(index: number, url: string | null) {
    const next = [...values];
    if (url) {
      if (index < next.length) next[index] = url;
      else next.push(url);
    } else if (index < next.length) {
      next.splice(index, 1);
    }
    onChange(next.slice(0, max));
  }

  async function removeAt(index: number) {
    const url = values[index];
    if (url?.startsWith("/api/uploads/")) {
      await deleteStoredUploadByUrl(url);
    }
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <p className="mb-3 text-xs text-[var(--admin-muted)]">
        Upload up to {max} images. Stored in MongoDB — works on Vercel after deploy.
      </p>
      <div className="space-y-4">
        {slots.map((url, index) => (
          <div key={`${index}-${url ?? "empty"}`} className="rounded-lg border border-[var(--admin-border)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--admin-muted)]">Image {index + 1}</span>
              {url && values.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-red-400 hover:underline"
                  onClick={() => void removeAt(index)}
                >
                  Remove slot
                </button>
              )}
            </div>
            <LocalImageField
              value={url}
              onChange={(next) => updateAt(index, next)}
              folder={folder}
              label=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
