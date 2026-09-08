import { describe, expect, it } from "vitest";
import { isLegacyDiskUploadUrl, resolveImageSrc } from "@/lib/image-utils";
import { safeMediaPath } from "@/lib/media/upload";

describe("media path safety", () => {
  it("rejects path traversal", () => {
    expect(safeMediaPath("../../etc/passwd")).toBeNull();
    expect(safeMediaPath("..\\..\\windows\\system32")).toBeNull();
  });

  it("returns null for missing files", () => {
    expect(safeMediaPath("2026/08/nonexistent.webp")).toBeNull();
  });
});

describe("image src resolution", () => {
  it("falls back for legacy disk upload URLs", () => {
    expect(isLegacyDiskUploadUrl("/uploads/2026/photo.jpg")).toBe(true);
    expect(resolveImageSrc("/uploads/2026/photo.jpg")).toBe("/assets/demo/card-back-classic.svg");
    expect(resolveImageSrc("/api/uploads/products/test.jpg")).toBe("/api/uploads/products/test.jpg");
  });
});

describe("upload root resolution", () => {
  it("resolves relative upload dir from cwd", async () => {
    const { resolveUploadRoot } = await import("@/lib/media/upload");
    const root = resolveUploadRoot();
    expect(root).toContain("uploads");
  });
});
