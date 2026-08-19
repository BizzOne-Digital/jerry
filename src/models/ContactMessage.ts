import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    inquiryType: {
      type: String,
      enum: ["Buy", "Sell", "Trade", "Autograph", "Memorabilia", "Tickets", "Order Support", "Other"],
      required: true,
    },
    referencedService: String,
    referencedProduct: String,
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
      index: true,
    },
    internalNotes: String,
    ipAddress: String,
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });

export type ContactMessageDocument = InferSchemaType<typeof ContactMessageSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ContactMessage: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<ContactMessageDocument>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
