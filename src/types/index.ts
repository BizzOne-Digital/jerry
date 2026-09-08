export const CONTENT_STATUS = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUS)[number];

export const PRODUCT_CATEGORIES = [
  "Cards",
  "Autographs",
  "Memorabilia",
  "Tickets",
  "Packages",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const INQUIRY_TYPES = [
  "Buy",
  "Sell",
  "Trade",
  "Autograph",
  "Memorabilia",
  "Tickets",
  "Order Support",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const ORDER_STATUSES = [
  "pending",
  "awaiting_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "awaiting_payment",
  "paid",
  "failed",
  "refunded",
  "manual_invoice",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const FULFILLMENT_STATUSES = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export const FAQ_CATEGORIES = [
  "Buying",
  "Selling",
  "Trading",
  "Authenticity",
  "Tickets",
  "Shipping",
  "Packages",
  "General",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const SPORTS = [
  "Baseball",
  "Basketball",
  "Football",
  "Hockey",
  "Soccer",
  "Other",
] as const;

export type Sport = (typeof SPORTS)[number];

export const COLLECTIBLE_TYPES = [
  "Cards",
  "Autographs",
  "Memorabilia",
  "Tickets",
  "Packages",
] as const;

export type CollectibleType = (typeof COLLECTIBLE_TYPES)[number];

export const BUDGET_RANGES = [
  "Under $50",
  "$50 – $100",
  "$100 – $250",
  "$250 – $500",
  "$500+",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const QUESTIONNAIRE_STATUSES = ["submitted", "reviewed", "archived"] as const;

export type QuestionnaireStatus = (typeof QUESTIONNAIRE_STATUSES)[number];

export const PAGE_KEYS = [
  "home",
  "about",
  "services",
  "shop",
  "pricing",
  "testimonials",
  "faqs",
  "contact",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export interface ImageRef {
  url: string;
  alt?: string;
  caption?: string;
  mediaId?: string;
  focalPoint?: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface PageSection {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
  cta?: CtaLink;
  secondaryCta?: CtaLink;
  image?: ImageRef;
  backgroundImage?: ImageRef;
  images?: ImageRef[];
  metadata?: Record<string, unknown>;
}

export interface SeoFields {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: ImageRef;
  noIndex?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
  options?: Record<string, string>;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: string;
  variantName?: string;
  sku?: string;
}

export interface StatusHistoryEntry {
  status: string;
  note?: string;
  changedBy?: string;
  changedAt: Date;
}
