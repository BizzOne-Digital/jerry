import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withAdmin(
  handler: (session: Awaited<ReturnType<typeof requireAdmin>>) => Promise<NextResponse>
) {
  try {
    const session = await requireAdmin();
    await connectDB();
    return await handler(session);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    if (message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }
    console.error("[admin api]", err);
    return jsonError(message, 500);
  }
}

export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
