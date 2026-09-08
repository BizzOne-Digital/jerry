import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { UPLOAD_FOLDERS } from "@/types";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS, index: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDocument = InferSchemaType<typeof StoredUploadSchema> & {
  _id: mongoose.Types.ObjectId;
};

const StoredUpload: Model<StoredUploadDocument> =
  mongoose.models.StoredUpload ||
  mongoose.model<StoredUploadDocument>("StoredUpload", StoredUploadSchema);

export default StoredUpload;
