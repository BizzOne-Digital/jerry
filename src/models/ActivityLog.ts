import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: String,
    description: String,
    adminId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    adminEmail: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

export type ActivityLogDocument = InferSchemaType<typeof ActivityLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ActivityLog: Model<ActivityLogDocument> =
  mongoose.models.ActivityLog ||
  mongoose.model<ActivityLogDocument>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
