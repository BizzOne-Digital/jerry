import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { rateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { calculateOrderTotals, generateOrderNumber } from "@/lib/commerce/utils";
import type { CartItem } from "@/types";

const cartItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  image: z.string().optional(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  sku: z.string().optional(),
});

const schema = z.object({
  items: z.array(cartItemSchema).min(1),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default("US"),
  }),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const { success } = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { items, customer, notes } = schema.parse(body);

    await connectDB();

    const validatedItems: CartItem[] = [];
    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, status: "published" });
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }
      if (product.stock < item.quantity && !product.allowBackorder) {
        return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 });
      }
      validatedItems.push({
        ...item,
        price: product.price,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
      });
    }

    const { subtotal, shipping, tax, total } = calculateOrderTotals(validatedItems);
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      items: validatedItems.map((i) => ({
        productId: i.productId,
        slug: i.slug,
        name: i.name,
        sku: i.sku,
        price: i.price,
        quantity: i.quantity,
        variantId: i.variantId,
        variantName: i.variantName,
        image: i.image,
      })),
      subtotal,
      shipping,
      tax,
      total,
      customer,
      shippingAddress: customer,
      notes,
      paymentMethod: "manual_invoice",
      paymentStatus: "manual_invoice",
      orderStatus: "awaiting_payment",
      statusHistory: [{ status: "awaiting_payment", note: "Order placed via checkout" }],
    });

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, orderId: order._id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid checkout data", details: err.flatten() }, { status: 400 });
    }
    console.error("Checkout API error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
