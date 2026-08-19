import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    slug: String,
    name: { type: String, required: true },
    sku: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variantId: String,
    variantName: String,
    image: String,
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const StatusHistorySchema = new Schema(
  {
    status: String,
    note: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    customer: AddressSchema,
    billing: AddressSchema,
    shippingAddress: AddressSchema,
    notes: String,
    paymentMethod: { type: String, default: "manual_invoice" },
    paymentStatus: {
      type: String,
      enum: ["awaiting_payment", "paid", "failed", "refunded", "manual_invoice"],
      default: "awaiting_payment",
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ["unfulfilled", "processing", "shipped", "delivered", "cancelled"],
      default: "unfulfilled",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "awaiting_payment", "paid", "processing", "shipped", "completed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    stripeSessionId: String,
    statusHistory: [StatusHistorySchema],
    internalNotes: String,
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customer.email": 1 });

export type OrderDocument = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
