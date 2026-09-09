import { NextRequest } from "next/server";
import { jsonError, jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import SiteSettings from "@/models/SiteSettings";
import { revalidateSettings } from "@/lib/revalidation";

export async function GET() {
  return withAdmin(async () => {
    let settings = await SiteSettings.findOne({ singletonKey: "default" }).lean();
    if (!settings) {
      settings = (await SiteSettings.create({})).toObject();
    }
    return jsonOk(serialize(settings));
  });
}

export async function PATCH(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const existing = await SiteSettings.findOne({ singletonKey: "default" }).lean();

    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: "default" },
      {
        $set: {
          ...(body.general && { general: { ...existing?.general, ...body.general } }),
          ...(body.contact && { contact: { ...existing?.contact, ...body.contact } }),
          ...(body.social && { social: { ...existing?.social, ...body.social } }),
          ...(body.commerce && { commerce: { ...existing?.commerce, ...body.commerce } }),
          ...(body.footer && { footer: { ...existing?.footer, ...body.footer } }),
          ...(body.motion && { motion: { ...existing?.motion, ...body.motion } }),
        },
      },
      { new: true, upsert: true }
    ).lean();

    revalidateSettings();
    return jsonOk(serialize(settings));
  });
}
