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

const CtaSchema = new Schema(
  {
    label: String,
    href: String,
  },
  { _id: false }
);

const PageSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    eyebrow: String,
    heading: String,
    subheading: String,
    body: String,
    items: [String],
    stats: [{ label: String, value: String }],
    cta: CtaSchema,
    secondaryCta: CtaSchema,
    image: ImageRefSchema,
    backgroundImage: ImageRefSchema,
    images: [ImageRefSchema],
    metadata: Schema.Types.Mixed,
  },
  { _id: false }
);

const SeoSchema = new Schema(
  {
    title: String,
    description: String,
    canonical: String,
    ogImage: ImageRefSchema,
    noIndex: Boolean,
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    sections: [PageSectionSchema],
    seo: SeoSchema,
  },
  { timestamps: true }
);

export type PageDocument = InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Page: Model<PageDocument> =
  mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);

export default Page;
