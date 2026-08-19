import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ["Buying", "Selling", "Trading", "Authenticity", "Tickets", "Shipping", "Packages", "General"],
      default: "General",
      index: true,
    },
    relatedPageKey: String,
    relatedServiceId: { type: Schema.Types.ObjectId, ref: "Service" },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
  },
  { timestamps: true }
);

FAQSchema.index({ status: 1, category: 1, sortOrder: 1 });
FAQSchema.index({ question: "text", answer: "text" });

export type FAQDocument = InferSchemaType<typeof FAQSchema> & {
  _id: mongoose.Types.ObjectId;
};

const FAQ: Model<FAQDocument> =
  mongoose.models.FAQ || mongoose.model<FAQDocument>("FAQ", FAQSchema);

export default FAQ;
