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

const TestimonialSchema = new Schema(
  {
    customerName: { type: String, required: true },
    title: String,
    location: String,
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    avatar: ImageRefSchema,
    associatedProductId: { type: Schema.Types.ObjectId, ref: "Product" },
    associatedServiceId: { type: Schema.Types.ObjectId, ref: "Service" },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TestimonialSchema.index({ status: 1, sortOrder: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Testimonial: Model<TestimonialDocument> =
  mongoose.models.Testimonial ||
  mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);

export default Testimonial;
