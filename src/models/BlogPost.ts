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

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: String,
    coverImage: ImageRefSchema,
    authorName: { type: String, default: "Sodapops Team" },
    category: String,
    tags: [String],
    body: { type: String, required: true },
    inlineImages: [ImageRefSchema],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    isDemo: { type: Boolean, default: false },
    publishDate: Date,
    plannedPublishDate: Date,
    seo: {
      title: String,
      description: String,
      ogImage: ImageRefSchema,
    },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ status: 1, publishDate: -1 });

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

const BlogPost: Model<BlogPostDocument> =
  mongoose.models.BlogPost || mongoose.model<BlogPostDocument>("BlogPost", BlogPostSchema);

export default BlogPost;
