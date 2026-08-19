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

const SiteSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "default", unique: true },
    general: {
      companyName: { type: String, default: "Sodapops Collectibles LLC" },
      logoUrl: String,
      tagline: { type: String, default: "Collect. Trade. Experience the Game." },
      announcementText: String,
      defaultSeoTitle: String,
      defaultSeoDescription: String,
    },
    contact: {
      email: { type: String, default: "sodascards@gmail.com" },
      phone: { type: String, default: "+1 (309) 278-2664" },
      phoneLink: { type: String, default: "tel:+13092782664" },
      address: String,
      businessHours: String,
    },
    social: {
      instagram: String,
      facebook: String,
      x: String,
      tiktok: String,
      youtube: String,
    },
    commerce: {
      currency: { type: String, default: "USD" },
      manualInvoiceInstructions: String,
      shippingNotes: String,
      returnNotes: String,
      lowStockDefault: { type: Number, default: 3 },
    },
    footer: {
      description: String,
      newsletterCopy: String,
      copyright: String,
      privacyLink: { type: String, default: "/privacy" },
      termsLink: { type: String, default: "/terms" },
    },
    motion: {
      enableIntro: { type: Boolean, default: true },
      introOncePerSession: { type: Boolean, default: true },
      normalIntensity: { type: String, enum: ["low", "normal", "high"], default: "normal" },
      reducedIntensity: { type: String, enum: ["low", "normal", "high"], default: "low" },
    },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

const SiteSettings: Model<SiteSettingsDocument> =
  mongoose.models.SiteSettings ||
  mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
