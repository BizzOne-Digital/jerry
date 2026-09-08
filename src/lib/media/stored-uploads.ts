import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import StoredUpload from "@/models/StoredUpload";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/types";

export const MAX_STORED_UPLOAD_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const STORED_UPLOAD_MIMES = new Set(Object.keys(MIME_TO_EXT));

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function mimeToExtension(mimeType: string): string | null {
  return MIME_TO_EXT[mimeType] ?? null;
}

export function buildStoredUploadUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const folder = match[1];
  const filename = match[2];
  if (!isUploadFolder(folder)) return null;
  if (!isSafeFilename(filename)) return null;
  return { folder, filename };
}

export function isSafeFilename(filename: string): boolean {
  return Boolean(filename) && !filename.includes("..") && !filename.includes("/") && !filename.includes("\\");
}

export function generateStoredFilename(mimeType: string): string {
  const ext = mimeToExtension(mimeType);
  if (!ext) throw new Error("Unsupported image format");
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function saveStoredUpload(
  folder: UploadFolder,
  buffer: Buffer,
  mimeType: string
): Promise<{ url: string; filename: string; size: number; folder: UploadFolder }> {
  if (!STORED_UPLOAD_MIMES.has(mimeType)) {
    throw new Error("Unsupported image format");
  }
  if (buffer.length > MAX_STORED_UPLOAD_BYTES) {
    throw new Error("File exceeds maximum size of 8MB");
  }

  await connectDB();
  const filename = generateStoredFilename(mimeType);

  await StoredUpload.create({
    folder,
    filename,
    mimeType,
    size: buffer.length,
    data: buffer,
  });

  return {
    url: buildStoredUploadUrl(folder, filename),
    filename,
    size: buffer.length,
    folder,
  };
}

export async function deleteStoredUpload(folder: UploadFolder, filename: string): Promise<boolean> {
  if (!isSafeFilename(filename)) return false;
  await connectDB();
  const result = await StoredUpload.deleteOne({ folder, filename });
  return result.deletedCount > 0;
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return false;
  return deleteStoredUpload(parsed.folder, parsed.filename);
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  if (!isSafeFilename(filename)) return null;
  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}
