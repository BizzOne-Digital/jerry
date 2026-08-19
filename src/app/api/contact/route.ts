import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { INQUIRY_TYPES } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  inquiryType: z.enum(INQUIRY_TYPES),
  referencedService: z.string().optional(),
  referencedProduct: z.string().optional(),
  message: z.string().min(10),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    await connectDB();
    await ContactMessage.create({
      ...data,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: err.flatten() }, { status: 400 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
