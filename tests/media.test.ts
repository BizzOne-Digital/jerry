import { describe, expect, it } from "vitest";
import { safeMediaPath } from "@/lib/media/upload";
import path from "path";

describe("media path safety", () => {
  it("rejects path traversal", () => {
    expect(safeMediaPath("../../etc/passwd")).toBeNull();
    expect(safeMediaPath("..\\..\\windows\\system32")).toBeNull();
  });

  it("returns null for missing files", () => {
    expect(safeMediaPath("2026/08/nonexistent.webp")).toBeNull();
  });
});

describe("upload root resolution", () => {
  it("resolves relative upload dir from cwd", async () => {
    const { resolveUploadRoot } = await import("@/lib/media/upload");
    const root = resolveUploadRoot();
    expect(root).toContain("uploads");
  });
});
