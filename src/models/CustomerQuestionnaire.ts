import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CustomerQuestionnaireSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: String,
    favoriteSports: { type: [String], default: [] },
    favoriteTeams: { type: [String], default: [] },
    favoritePlayers: { type: [String], default: [] },
    itemsToCollect: { type: [String], default: [] },
    collectingGoals: String,
    budgetRange: String,
    additionalNotes: String,
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    orderNumber: { type: String, index: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["submitted", "reviewed", "archived"],
      default: "submitted",
      index: true,
    },
    internalNotes: String,
    ipAddress: String,
  },
  { timestamps: true }
);

CustomerQuestionnaireSchema.index({ createdAt: -1 });
CustomerQuestionnaireSchema.index({ status: 1, createdAt: -1 });

export type CustomerQuestionnaireDocument = InferSchemaType<typeof CustomerQuestionnaireSchema> & {
  _id: mongoose.Types.ObjectId;
};

const CustomerQuestionnaire: Model<CustomerQuestionnaireDocument> =
  mongoose.models.CustomerQuestionnaire ||
  mongoose.model<CustomerQuestionnaireDocument>("CustomerQuestionnaire", CustomerQuestionnaireSchema);

export default CustomerQuestionnaire;
