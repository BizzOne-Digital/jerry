import type { ImageRef, PageSection, SeoFields } from "@/types";

export interface SerializedPage {
  _id: string;
  key: string;
  title: string;
  status: string;
  sections?: PageSection[];
  seo?: SeoFields;
}

export interface SerializedService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  cardImage?: ImageRef;
  detailImages?: ImageRef[];
  overview?: string;
  benefits?: string[];
  processSteps?: { title?: string; description?: string; image?: ImageRef }[];
  detailHero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    image?: ImageRef;
    backgroundImage?: ImageRef;
  };
  serviceFaqs?: { question?: string; answer?: string }[];
  importantNotes?: string[];
  cta?: { label?: string; href?: string };
  featureSection?: {
    heading?: string;
    body?: string;
    image?: ImageRef;
  };
}

export interface SerializedOffer {
  _id: string;
  name: string;
  slug: string;
  price: number;
  summary?: string;
  images?: ImageRef[];
  includedItems?: string[];
  guaranteedItems?: string[];
  variableDisclaimer?: string;
  availability?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface SerializedFaq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface SerializedTestimonial {
  _id: string;
  customerName: string;
  title?: string;
  text: string;
  rating?: number;
  avatar?: ImageRef;
  isDemo?: boolean;
}

export interface SerializedBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: ImageRef;
  authorName?: string;
  category?: string;
  body?: string;
  inlineImages?: ImageRef[];
  publishDate?: string;
  isDemo?: boolean;
}

export interface SerializedProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  condition?: string;
  conditionNotes?: string;
  isAuthenticated?: boolean;
  coaReference?: string;
  images?: ImageRef[];
  featured?: boolean;
  onSale?: boolean;
  variants?: { id: string; name: string; sku?: string; price?: number; stock?: number }[];
}
