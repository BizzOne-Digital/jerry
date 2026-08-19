import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Order from "@/models/Order";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const order = await Order.findById(id).lean();
    if (!order) return jsonError("Order not found", 404);
    return jsonOk(serialize(order));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async (session) => {
    const body = await req.json();
    const $set: Record<string, unknown> = {};

    if (body.orderStatus) $set.orderStatus = body.orderStatus;
    if (body.paymentStatus) $set.paymentStatus = body.paymentStatus;
    if (body.fulfillmentStatus) $set.fulfillmentStatus = body.fulfillmentStatus;
    if (body.internalNotes !== undefined) $set.internalNotes = body.internalNotes;

    const update: Record<string, unknown> = { $set };
    if (body.orderStatus) {
      update.$push = {
        statusHistory: {
          status: body.orderStatus,
          note: body.statusNote,
          changedBy: session.user.email ?? session.user.id,
          changedAt: new Date(),
        },
      };
    }

    const order = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!order) return jsonError("Order not found", 404);
    return jsonOk(serialize(order));
  });
}
