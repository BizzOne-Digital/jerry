import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
  },
  { timestamps: true }
);

ProductCategorySchema.index({ slug: 1 });

export type ProductCategoryDocument = InferSchemaType<typeof ProductCategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

const ProductCategory: Model<ProductCategoryDocument> =
  mongoose.models.ProductCategory ||
  mongoose.model<ProductCategoryDocument>("ProductCategory", ProductCategorySchema);

export default ProductCategory;
