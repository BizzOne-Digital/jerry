import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import CustomerQuestionnaire from "@/models/CustomerQuestionnaire";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const questionnaire = await CustomerQuestionnaire.findById(id).lean();
    if (!questionnaire) return jsonError("Not found", 404);
    return jsonOk(serialize(questionnaire));
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const body = await req.json();
    const questionnaire = await CustomerQuestionnaire.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!questionnaire) return jsonError("Not found", 404);
    return jsonOk(serialize(questionnaire));
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return withAdmin(async () => {
    const questionnaire = await CustomerQuestionnaire.findByIdAndDelete(id).lean();
    if (!questionnaire) return jsonError("Not found", 404);
    return jsonOk({ success: true });
  });
}
