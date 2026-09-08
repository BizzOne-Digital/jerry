import { NextRequest } from "next/server";
import { jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  return withAdmin(async () => {
    const status = req.nextUrl.searchParams.get("status");
    const filter = status ? { orderStatus: status } : {};
    const items = await Order.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return jsonOk(serialize({ items }));
  });
}
