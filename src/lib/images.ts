import type { ImageRef } from "@/types";

const SITE = "/assets/site";

/** Site photography and category imagery. */
export const BRAND_IMAGES = {
  logo: "/assets/branding/sodapops-logo.png",
  hero: `${SITE}/hero-shop.jpg`,
  heroFallback: `${SITE}/cards.jpg`,
  cards: `${SITE}/cards.jpg`,
  autographs: `${SITE}/autographs.jpg`,
  memorabilia: `${SITE}/memorabilia.jpg`,
  tickets: `${SITE}/tickets.jpg`,
  vault: `${SITE}/vault.jpg`,
  arena: `${SITE}/collector-triptych.jpg`,
  trading: `${SITE}/trading-desk.jpg`,
  collection: `${SITE}/treasure-chest.jpg`,
  stadium: `${SITE}/hero-shop.jpg`,
  jersey: `${SITE}/memorabilia-wall.jpg`,
  display: `${SITE}/graded-pedestal.jpg`,
  allStar: "/assets/demo/all-star-logo.png",
  mvp: "/assets/demo/mvp-logo.png",
  package: "/assets/demo/all-star-logo.png",
  packagesGift: `${SITE}/packages-gift.jpg`,
  handshake: `${SITE}/trading-desk.jpg`,
  crowd: `${SITE}/team-show.jpg`,
  spotlight: `${SITE}/family-packs.jpg`,
  familyPacks: `${SITE}/family-packs.jpg`,
  vintage: `${SITE}/card-marble.jpg`,
  grading: `${SITE}/card-sleeving.jpg`,
  blog1: `${SITE}/card-marble.jpg`,
  blog2: "/assets/demo/mvp-logo.png",
  blog3: `${SITE}/memorabilia-wall.jpg`,
  about1: `${SITE}/card-show-inspect.jpg`,
  about2: `${SITE}/card-photography.jpg`,
  about3: `${SITE}/team-show.jpg`,
  about4: `${SITE}/collector-triptych.jpg`,
  about5: "/assets/demo/all-star-logo.png",
  about6: `${SITE}/memorabilia-wall.jpg`,
  contact: `${SITE}/contact-desk.jpg`,
  pricing: `${SITE}/packages-gift.jpg`,
  services: `${SITE}/trading-desk.jpg`,
  faq: `${SITE}/faq-question.jpg`,
} as const;

export function img(url: string, alt: string): ImageRef {
  return { url, alt };
}

/** Resolve All-Star or MVP logo from slug, name, or tags. */
export function getPackageLogo(identifier: string): string {
  const key = identifier.toLowerCase();
  if (key.includes("mvp")) return BRAND_IMAGES.mvp;
  if (key.includes("all-star") || key.includes("allstar")) return BRAND_IMAGES.allStar;
  return BRAND_IMAGES.package;
}

/** Map legacy demo emblem paths to the new package logos. */
export function normalizePackageImageUrl(url: string): string {
  if (/all-star-emblem\.svg/i.test(url)) return BRAND_IMAGES.allStar;
  if (/mvp-emblem\.svg/i.test(url)) return BRAND_IMAGES.mvp;
  return url;
}

export function resolvePackageImage(
  imageUrl: string | undefined,
  identifier: string,
  fallback?: string,
): string {
  const resolved = imageUrl ?? fallback ?? getPackageLogo(identifier);
  return normalizePackageImageUrl(resolved);
}

export const HOMEPAGE_GALLERY: ImageRef[] = [
  img(BRAND_IMAGES.cards, "Premium sports trading cards"),
  img(BRAND_IMAGES.autographs, "Authenticated autograph memorabilia"),
  img(BRAND_IMAGES.memorabilia, "Game-worn memorabilia display"),
  img(BRAND_IMAGES.tickets, "Premium event tickets"),
  img(BRAND_IMAGES.vault, "Secure collector vault storage"),
  img(BRAND_IMAGES.collection, "Curated collector showcase"),
];

export const ABOUT_GALLERY: ImageRef[] = [
  img(BRAND_IMAGES.about1, "Inspecting cards at a show"),
  img(BRAND_IMAGES.about2, "Professional card photography setup"),
  img(BRAND_IMAGES.about3, "Sodapops team at a card show"),
  img(BRAND_IMAGES.about4, "Grading, trading, and collecting"),
  img(BRAND_IMAGES.about5, "All-Star collector packages"),
  img(BRAND_IMAGES.about6, "Championship memorabilia display"),
];
