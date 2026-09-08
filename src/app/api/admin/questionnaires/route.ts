import { NextRequest } from "next/server";
import { jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import CustomerQuestionnaire from "@/models/CustomerQuestionnaire";

export async function GET(req: NextRequest) {
  return withAdmin(async () => {
    const status = req.nextUrl.searchParams.get("status");
    const orderId = req.nextUrl.searchParams.get("orderId");
    const email = req.nextUrl.searchParams.get("email");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (orderId) filter.orderId = orderId;
    if (email) filter.email = email.toLowerCase();

    const items = await CustomerQuestionnaire.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return jsonOk(serialize({ items }));
  });
}
