import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import MediaAsset from "@/models/MediaAsset";
import { requireAdmin } from "@/lib/auth/auth";
import { processAndSaveUpload, MAX_UPLOAD_BYTES } from "@/lib/media/upload";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processAndSaveUpload(buffer, file.name);

    await connectDB();
    const asset = await MediaAsset.create({
      originalName: file.name,
      diskPath: result.diskPath,
      publicUrl: result.publicUrl,
      mimeType: result.mimeType,
      byteSize: result.byteSize,
      width: result.width,
      height: result.height,
      altText: (formData.get("altText") as string) || undefined,
      caption: (formData.get("caption") as string) || undefined,
      uploadedBy: session.user.id,
      variants: result.variants,
    });

    return NextResponse.json({
      success: true,
      asset: JSON.parse(JSON.stringify(asset)),
      publicUrl: result.publicUrl,
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
