import path from "path";
import fs from "fs/promises";
import { createReadStream, existsSync } from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { getEnv } from "@/lib/env";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const PROJECT_UPLOAD_DIR = "uploads";
const DEFAULT_UPLOAD_ROOT = path.join(process.cwd(), PROJECT_UPLOAD_DIR);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "webp",
  "image/png": "webp",
  "image/webp": "webp",
  "image/avif": "webp",
};

function normalizeRelativeUploadDir(uploadDir: string): string {
  return uploadDir.replace(/^\.\//, "").replace(/\/$/, "");
}

export function resolveUploadRoot(): string {
  const { UPLOAD_DIR } = getEnv();
  if (path.isAbsolute(UPLOAD_DIR)) {
    return UPLOAD_DIR;
  }

  const relativeDir = normalizeRelativeUploadDir(UPLOAD_DIR);
  if (relativeDir === PROJECT_UPLOAD_DIR) {
    return DEFAULT_UPLOAD_ROOT;
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), relativeDir);
}

export function buildUploadPath(filename: string): { diskPath: string; publicUrl: string; relativePath: string } {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const relativePath = path.posix.join(year, month, filename);
  const uploadRoot = resolveUploadRoot();
  const diskPath =
    uploadRoot === DEFAULT_UPLOAD_ROOT
      ? path.join(DEFAULT_UPLOAD_ROOT, year, month, filename)
      : path.join(/* turbopackIgnore: true */ uploadRoot, year, month, filename);
  const publicUrl = `/media/${relativePath.replace(/\\/g, "/")}`;
  return { diskPath, publicUrl, relativePath };
}

export function safeMediaPath(requested: string): string | null {
  const uploadRoot = resolveUploadRoot();
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const fullPath =
    uploadRoot === DEFAULT_UPLOAD_ROOT
      ? path.join(DEFAULT_UPLOAD_ROOT, normalized)
      : path.join(/* turbopackIgnore: true */ uploadRoot, normalized);
  if (!fullPath.startsWith(uploadRoot)) return null;
  if (!fileExists(fullPath)) return null;
  return fullPath;
}

function fileExists(fullPath: string): boolean {
  if (fullPath.startsWith(DEFAULT_UPLOAD_ROOT)) {
    return existsSync(fullPath);
  }
  return existsSync(/* turbopackIgnore: true */ fullPath);
}

export async function ensureUploadDir(diskPath: string): Promise<void> {
  await fs.mkdir(path.dirname(diskPath), { recursive: true });
}

export async function validateImageBuffer(buffer: Buffer): Promise<{ mime: string; width: number; height: number }> {
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds maximum size of 10MB");
  }

  const metadata = await sharp(buffer).metadata();
  const mime = metadata.format ? `image/${metadata.format === "jpeg" ? "jpeg" : metadata.format}` : "";

  if (!ALLOWED_MIMES.has(mime) && metadata.format !== "jpeg" && metadata.format !== "png" && metadata.format !== "webp" && metadata.format !== "avif") {
    throw new Error("Unsupported image format");
  }

  const normalizedMime =
    metadata.format === "jpeg"
      ? "image/jpeg"
      : metadata.format === "png"
        ? "image/png"
        : metadata.format === "webp"
          ? "image/webp"
          : metadata.format === "avif"
            ? "image/avif"
            : mime;

  if (!ALLOWED_MIMES.has(normalizedMime)) {
    throw new Error("Unsupported image format");
  }

  return {
    mime: normalizedMime,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

export async function processAndSaveUpload(
  buffer: Buffer,
  originalName: string
): Promise<{
  diskPath: string;
  publicUrl: string;
  mimeType: string;
  byteSize: number;
  width: number;
  height: number;
  variants: { label: string; diskPath: string; publicUrl: string; width: number; height: number }[];
}> {
  const { mime, width, height } = await validateImageBuffer(buffer);
  const ext = MIME_TO_EXT[mime] ?? "webp";
  const filename = `${uuidv4()}.${ext}`;
  const { diskPath, publicUrl, relativePath } = buildUploadPath(filename);

  await ensureUploadDir(diskPath);

  const webpBuffer = await sharp(buffer).rotate().webp({ quality: 85 }).toBuffer();
  await fs.writeFile(diskPath, webpBuffer);

  const variants: { label: string; diskPath: string; publicUrl: string; width: number; height: number }[] = [];

  for (const [label, size] of [
    ["thumb", 400],
    ["medium", 900],
  ] as const) {
    const variantFilename = `${uuidv4()}-${label}.webp`;
    const variantInfo = buildUploadPath(variantFilename);
    await ensureUploadDir(variantInfo.diskPath);
    const resized = await sharp(buffer)
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const resizedMeta = await sharp(resized).metadata();
    await fs.writeFile(variantInfo.diskPath, resized);
    variants.push({
      label,
      diskPath: variantInfo.diskPath,
      publicUrl: variantInfo.publicUrl,
      width: resizedMeta.width ?? size,
      height: resizedMeta.height ?? 0,
    });
  }

  return {
    diskPath,
    publicUrl,
    mimeType: "image/webp",
    byteSize: webpBuffer.length,
    width,
    height,
    variants,
  };
}

export async function checkUploadDirWritable(): Promise<boolean> {
  try {
    const root = resolveUploadRoot();
    await fs.mkdir(root, { recursive: true });
    const testFile = path.join(root, ".write-test");
    await fs.writeFile(testFile, "ok");
    await fs.unlink(testFile);
    return true;
  } catch {
    return false;
  }
}

export function createMediaReadStream(fullPath: string) {
  return createReadStream(fullPath);
}

export { MAX_UPLOAD_BYTES, ALLOWED_MIMES };
