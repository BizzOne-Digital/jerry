import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import ContactMessage from "@/models/ContactMessage";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const message = await ContactMessage.findById(id).lean();
    if (!message) return jsonError("Not found", 404);

    if (message.status === "unread") {
      await ContactMessage.findByIdAndUpdate(id, { status: "read" });
      message.status = "read";
    }

    return jsonOk(serialize(message));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const message = await ContactMessage.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!message) return jsonError("Not found", 404);
    return jsonOk(serialize(message));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const message = await ContactMessage.findByIdAndDelete(id).lean();
    if (!message) return jsonError("Not found", 404);
    return jsonOk({ success: true });
  });
}
