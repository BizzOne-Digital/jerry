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

const ServiceFaqSchema = new Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const ProcessStepSchema = new Schema(
  {
    title: String,
    description: String,
    image: ImageRefSchema,
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    cardImage: ImageRefSchema,
    iconAccent: { type: String, default: "gold" },
    ctaLabel: { type: String, default: "Learn More" },
    sortOrder: { type: Number, default: 0, index: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
    detailHero: {
      eyebrow: String,
      heading: String,
      subheading: String,
      image: ImageRefSchema,
      backgroundImage: ImageRefSchema,
    },
    overview: String,
    benefits: [String],
    processSteps: [ProcessStepSchema],
    importantNotes: [String],
    serviceFaqs: [ServiceFaqSchema],
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    detailImages: [ImageRefSchema],
    featureSection: {
      heading: String,
      body: String,
      image: ImageRefSchema,
    },
    cta: {
      label: String,
      href: String,
    },
    seo: {
      title: String,
      description: String,
      ogImage: ImageRefSchema,
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ status: 1, sortOrder: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Service: Model<ServiceDocument> =
  mongoose.models.Service || mongoose.model<ServiceDocument>("Service", ServiceSchema);

export default Service;
