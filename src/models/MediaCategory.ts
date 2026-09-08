import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MediaCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    coverImageUrl: String,
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

MediaCategorySchema.index({ slug: 1 });
MediaCategorySchema.index({ status: 1, sortOrder: 1 });

export type MediaCategoryDocument = InferSchemaType<typeof MediaCategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

const MediaCategory: Model<MediaCategoryDocument> =
  mongoose.models.MediaCategory ||
  mongoose.model<MediaCategoryDocument>("MediaCategory", MediaCategorySchema);

export default MediaCategory;
