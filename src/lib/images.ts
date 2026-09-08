import type { ImageRef } from "@/types";

const SITE = "/assets/site";

/** Site photography and category imagery. */
export const BRAND_IMAGES = {
  logo: "/assets/branding/sodapops-logo.png",
  hero: `${SITE}/hero-background.png`,
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

const CATEGORY_PRODUCT_IMAGES: Record<string, string> = {
  Cards: BRAND_IMAGES.cards,
  Autographs: BRAND_IMAGES.autographs,
  Memorabilia: BRAND_IMAGES.memorabilia,
  Tickets: BRAND_IMAGES.tickets,
  Packages: BRAND_IMAGES.packagesGift,
};

const PRODUCT_IMAGES_BY_SLUG: Record<string, string> = {
  "demo-rookie-card-mint": BRAND_IMAGES.cards,
  "demo-graded-card-psa9": BRAND_IMAGES.display,
  "demo-signed-photo-coa": BRAND_IMAGES.autographs,
  "demo-display-mini-helmet": BRAND_IMAGES.memorabilia,
  "demo-game-used-bat": BRAND_IMAGES.jersey,
  "demo-event-ticket": BRAND_IMAGES.tickets,
  "demo-card-lot-50": BRAND_IMAGES.collection,
};

const PRODUCT_GALLERY_BY_SLUG: Record<string, string[]> = {
  "demo-rookie-card-mint": [
    BRAND_IMAGES.cards,
    BRAND_IMAGES.vintage,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.collection,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.display,
  ],
  "demo-graded-card-psa9": [
    BRAND_IMAGES.display,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.vault,
    BRAND_IMAGES.cards,
    BRAND_IMAGES.about1,
  ],
  "demo-signed-photo-coa": [
    BRAND_IMAGES.autographs,
    BRAND_IMAGES.about2,
    BRAND_IMAGES.trading,
    BRAND_IMAGES.memorabilia,
    BRAND_IMAGES.vintage,
  ],
  "demo-display-mini-helmet": [
    BRAND_IMAGES.memorabilia,
    BRAND_IMAGES.jersey,
    BRAND_IMAGES.stadium,
    BRAND_IMAGES.crowd,
    BRAND_IMAGES.arena,
  ],
  "demo-game-used-bat": [
    BRAND_IMAGES.jersey,
    BRAND_IMAGES.vintage,
    BRAND_IMAGES.memorabilia,
    BRAND_IMAGES.collection,
    BRAND_IMAGES.vault,
  ],
  "demo-event-ticket": [
    BRAND_IMAGES.tickets,
    BRAND_IMAGES.packagesGift,
    BRAND_IMAGES.arena,
    BRAND_IMAGES.crowd,
    BRAND_IMAGES.stadium,
  ],
  "demo-card-lot-50": [
    BRAND_IMAGES.collection,
    BRAND_IMAGES.cards,
    BRAND_IMAGES.collection,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.display,
  ],
  "all-star-surprise-package": [
    BRAND_IMAGES.allStar,
    BRAND_IMAGES.packagesGift,
    BRAND_IMAGES.collection,
    BRAND_IMAGES.cards,
    BRAND_IMAGES.autographs,
  ],
  "mvp-card-package": [
    BRAND_IMAGES.mvp,
    BRAND_IMAGES.packagesGift,
    BRAND_IMAGES.collection,
    BRAND_IMAGES.display,
    BRAND_IMAGES.autographs,
  ],
};

function isDemoPlaceholderImage(url: string): boolean {
  return /\/assets\/demo\/.*\.svg($|\?)/i.test(url);
}

/** Resolve storefront product imagery, upgrading legacy demo SVG placeholders. */
export function resolveProductImage(
  imageUrl: string | undefined,
  slug: string,
  category?: string,
): string {
  if (category === "Packages") {
    return resolvePackageImage(imageUrl, slug);
  }

  const bySlug = PRODUCT_IMAGES_BY_SLUG[slug];
  if (bySlug) return bySlug;

  if (imageUrl && !isDemoPlaceholderImage(imageUrl)) {
    return imageUrl;
  }

  if (category && CATEGORY_PRODUCT_IMAGES[category]) {
    return CATEGORY_PRODUCT_IMAGES[category];
  }

  return BRAND_IMAGES.cards;
}

export function resolveProductGalleryImages(
  slug: string,
  category: string | undefined,
  images: ImageRef[] | undefined,
  productName: string,
): ImageRef[] {
  const preset = PRODUCT_GALLERY_BY_SLUG[slug];
  if (preset) {
    return preset.map((url, index) => ({
      url,
      alt: images?.[index]?.alt ?? `${productName} photo ${index + 1}`,
    }));
  }

  const resolved = (images ?? [])
    .map((image, index) => ({
      url: resolveProductImage(image.url, slug, category),
      alt: image.alt ?? `${productName} photo ${index + 1}`,
    }))
    .filter((image, index, list) => list.findIndex((item) => item.url === image.url) === index);

  if (resolved.length >= 3) return resolved.slice(0, 6);

  const fallbacks = [
    BRAND_IMAGES.cards,
    BRAND_IMAGES.display,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.vintage,
    BRAND_IMAGES.collection,
  ];

  const merged = [...resolved];
  for (const url of fallbacks) {
    if (merged.length >= 5) break;
    if (!merged.some((image) => image.url === url)) {
      merged.push({ url, alt: productName });
    }
  }

  return merged.slice(0, 6);
}

const SERVICE_IMAGES_BY_SLUG: Record<string, string> = {
  "buy-collectible-cards": BRAND_IMAGES.cards,
  "sell-your-collection": BRAND_IMAGES.trading,
  selling: BRAND_IMAGES.trading,
  "trade-collectibles": BRAND_IMAGES.arena,
  trading: BRAND_IMAGES.arena,
  "authenticated-autographs": BRAND_IMAGES.autographs,
  "sports-memorabilia": BRAND_IMAGES.memorabilia,
  "affordable-game-tickets": BRAND_IMAGES.tickets,
};

/** Resolve service card imagery, upgrading legacy demo SVG placeholders. */
export function resolveServiceImage(imageUrl: string | undefined, slug: string): string {
  const bySlug = SERVICE_IMAGES_BY_SLUG[slug];
  if (bySlug) return bySlug;

  if (imageUrl && !isDemoPlaceholderImage(imageUrl)) {
    return imageUrl;
  }

  return BRAND_IMAGES.services;
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
