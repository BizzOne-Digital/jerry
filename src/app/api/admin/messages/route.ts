import { NextRequest } from "next/server";
import { jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import ContactMessage from "@/models/ContactMessage";

export async function GET(req: NextRequest) {
  return withAdmin(async () => {
    const status = req.nextUrl.searchParams.get("status");
    const filter = status ? { status } : {};
    const items = await ContactMessage.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return jsonOk(serialize({ items }));
  });
}
