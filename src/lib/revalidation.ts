import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  settings: "site-settings",
  pages: "pages",
  services: "services",
  products: "products",
  offers: "offers",
  testimonials: "testimonials",
  faqs: "faqs",
  blogs: "blogs",
} as const;

export function revalidateSettings() {
  revalidateTag(CACHE_TAGS.settings, "max");
  revalidatePath("/", "layout");
  revalidatePath("/contact");
}

export function revalidatePage(key: string) {
  revalidateTag(CACHE_TAGS.pages, "max");
  const paths: Record<string, string> = {
    home: "/",
    about: "/about",
    services: "/services",
    shop: "/shop",
    testimonials: "/testimonials",
    faqs: "/faqs",
    contact: "/contact",
  };
  const path = paths[key];
  if (path) revalidatePath(path);
}

export function revalidateService(slug?: string) {
  revalidateTag(CACHE_TAGS.services, "max");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
}

export function revalidateProduct(slug?: string) {
  revalidateTag(CACHE_TAGS.products, "max");
  revalidatePath("/shop");
  revalidatePath("/");
  if (slug) revalidatePath(`/shop/${slug}`);
}

export function revalidateOffers() {
  revalidateTag(CACHE_TAGS.offers, "max");
  revalidatePath("/");
}

export function revalidateTestimonials() {
  revalidateTag(CACHE_TAGS.testimonials, "max");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export function revalidateFaqs() {
  revalidateTag(CACHE_TAGS.faqs, "max");
  revalidatePath("/faqs");
  revalidatePath("/");
}

export function revalidateBlog(slug?: string) {
  revalidateTag(CACHE_TAGS.blogs, "max");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
