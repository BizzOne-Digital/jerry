import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ImageRefSchema = new Schema(
  {
    url: String,
    alt: String,
    caption: String,
    mediaId: String,
    focalPoint: String,
  },
  { _id: false }
);

const OfferSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    summary: String,
    includedItems: [String],
    guaranteedItems: [String],
    variableDisclaimer: String,
    sportEventLabel: String,
    inventory: { type: Number, default: 0 },
    availability: { type: String, enum: ["available", "limited", "sold_out"], default: "available" },
    startDate: Date,
    endDate: Date,
    ctaLabel: { type: String, default: "Request Package" },
    ctaHref: { type: String, default: "/contact?inquiry=Buy" },
    images: [ImageRefSchema],
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
    seo: {
      title: String,
      description: String,
      ogImage: ImageRefSchema,
    },
  },
  { timestamps: true }
);

OfferSchema.index({ slug: 1 });
OfferSchema.index({ status: 1, sortOrder: 1 });

export type OfferDocument = InferSchemaType<typeof OfferSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Offer: Model<OfferDocument> =
  mongoose.models.Offer || mongoose.model<OfferDocument>("Offer", OfferSchema);

export default Offer;
