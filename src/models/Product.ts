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

const VariantSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    sku: String,
    price: Number,
    stock: Number,
    options: Schema.Types.Mixed,
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: { type: String, required: true, index: true },
    tags: [String],
    shortDescription: String,
    longDescription: String,
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 3 },
    allowBackorder: { type: Boolean, default: false },
    condition: { type: String, default: "Unspecified" },
    conditionNotes: String,
    isAuthenticated: { type: Boolean, default: false },
    coaReference: String,
    images: [ImageRefSchema],
    variants: [VariantSchema],
    featured: { type: Boolean, default: false, index: true },
    onSale: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true },
    relatedProductIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    seo: {
      title: String,
      description: String,
      ogImage: ImageRefSchema,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ status: 1, featured: -1, createdAt: -1 });
ProductSchema.index({ name: "text", shortDescription: "text", tags: "text" });

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Product: Model<ProductDocument> =
  mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
