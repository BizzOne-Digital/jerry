import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import CustomerQuestionnaire from "@/models/CustomerQuestionnaire";
import Order from "@/models/Order";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { BUDGET_RANGES, COLLECTIBLE_TYPES, SPORTS } from "@/types";

function splitList(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  orderNumber: z.string().optional(),
  favoriteSports: z.array(z.enum(SPORTS)).min(1),
  favoriteTeams: z.string().min(1),
  favoritePlayers: z.string().optional(),
  itemsToCollect: z.array(z.enum(COLLECTIBLE_TYPES)).min(1),
  collectingGoals: z.string().optional(),
  budgetRange: z.union([z.enum(BUDGET_RANGES), z.literal("")]).optional(),
  additionalNotes: z.string().optional(),
  consent: z.literal(true),
});

export async function GET(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`questionnaire-lookup:${ip}`, 20, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const orderNumber = new URL(request.url).searchParams.get("order")?.trim();
  if (!orderNumber) {
    return NextResponse.json({ error: "Order number required" }, { status: 400 });
  }

  try {
    await connectDB();
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const customer = order.customer;
    return NextResponse.json({
      orderNumber: order.orderNumber,
      name: [customer?.firstName, customer?.lastName].filter(Boolean).join(" "),
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
    });
  } catch (err) {
    console.error("Questionnaire lookup error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`questionnaire:${ip}`, 5, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = schema.parse(body);

    await connectDB();

    let orderId: string | undefined;
    const orderNumber = data.orderNumber?.trim();

    if (orderNumber) {
      const order = await Order.findOne({ orderNumber }).lean();
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 400 });
      }
      orderId = String(order._id);
    }

    const questionnaire = await CustomerQuestionnaire.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      favoriteSports: data.favoriteSports,
      favoriteTeams: splitList(data.favoriteTeams),
      favoritePlayers: data.favoritePlayers ? splitList(data.favoritePlayers) : [],
      itemsToCollect: data.itemsToCollect,
      collectingGoals: data.collectingGoals,
      budgetRange: data.budgetRange || undefined,
      additionalNotes: data.additionalNotes,
      orderId,
      orderNumber,
      consent: data.consent,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, id: String(questionnaire._id) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: err.flatten() }, { status: 400 });
    }
    console.error("Questionnaire API error:", err);
    return NextResponse.json({ error: "Failed to submit questionnaire" }, { status: 500 });
  }
}
