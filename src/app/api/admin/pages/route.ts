import { jsonOk, serialize, withAdmin } from "@/lib/admin/api-helpers";
import Page from "@/models/Page";

export async function GET() {
  return withAdmin(async () => {
    const pages = await Page.find().sort({ key: 1 }).lean();
    return jsonOk(serialize({ items: pages }));
  });
}
