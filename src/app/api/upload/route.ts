import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import {
  deleteStoredUploadByUrl,
  isUploadFolder,
  MAX_STORED_UPLOAD_BYTES,
  mimeToExtension,
  saveStoredUpload,
  STORED_UPLOAD_MIMES,
} from "@/lib/media/stored-uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "").trim();

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isUploadFolder(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    if (file.size > MAX_STORED_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds maximum size of 8MB" }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    if (!STORED_UPLOAD_MIMES.has(mimeType) || !mimeToExtension(mimeType)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveStoredUpload(folder, buffer, mimeType);

    return NextResponse.json({
      success: true,
      url: saved.url,
      filename: saved.filename,
      size: saved.size,
      folder: saved.folder,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url : "";

    if (!url.startsWith("/api/uploads/")) {
      return NextResponse.json({ error: "Invalid upload URL" }, { status: 400 });
    }

    const deleted = await deleteStoredUploadByUrl(url);
    if (!deleted) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
