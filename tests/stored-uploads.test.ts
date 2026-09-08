import { describe, expect, it } from "vitest";
import {
  buildStoredUploadUrl,
  generateStoredFilename,
  isSafeFilename,
  isUploadFolder,
  parseStoredUploadUrl,
} from "@/lib/media/stored-uploads";

describe("stored upload helpers", () => {
  it("validates folders and filenames", () => {
    expect(isUploadFolder("products")).toBe(true);
    expect(isUploadFolder("invalid")).toBe(false);
    expect(isSafeFilename("1700000000-abc123.jpg")).toBe(true);
    expect(isSafeFilename("../secret.jpg")).toBe(false);
    expect(isSafeFilename("bad/name.jpg")).toBe(false);
  });

  it("builds and parses public URLs", () => {
    const url = buildStoredUploadUrl("gallery", "1700000000-abc123.jpg");
    expect(url).toBe("/api/uploads/gallery/1700000000-abc123.jpg");
    expect(parseStoredUploadUrl(url)).toEqual({
      folder: "gallery",
      filename: "1700000000-abc123.jpg",
    });
    expect(parseStoredUploadUrl("/uploads/old.jpg")).toBeNull();
  });

  it("generates filenames with supported extensions", () => {
    const filename = generateStoredFilename("image/png");
    expect(filename.endsWith(".png")).toBe(true);
    expect(filename.includes("-")).toBe(true);
  });
});
