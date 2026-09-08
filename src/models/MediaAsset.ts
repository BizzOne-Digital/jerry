import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    originalName: { type: String, required: true },
    diskPath: { type: String, required: true, unique: true },
    publicUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    byteSize: { type: Number, required: true },
    width: Number,
    height: Number,
    altText: String,
    caption: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "MediaCategory", index: true },
    sortOrder: { type: Number, default: 0 },
    referenceCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    variants: [
      {
        label: String,
        diskPath: String,
        publicUrl: String,
        width: Number,
        height: Number,
      },
    ],
  },
  { timestamps: true }
);

MediaAssetSchema.index({ categoryId: 1, sortOrder: 1 });
MediaAssetSchema.index({ originalName: "text", altText: "text" });

export type MediaAssetDocument = InferSchemaType<typeof MediaAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

const MediaAsset: Model<MediaAssetDocument> =
  mongoose.models.MediaAsset || mongoose.model<MediaAssetDocument>("MediaAsset", MediaAssetSchema);

export default MediaAsset;
