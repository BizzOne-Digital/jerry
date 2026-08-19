import type { ImageRef } from "@/types";

/** Local demo SVGs — reliable in dev without external image hosts. */
export const BRAND_IMAGES = {
  hero: "/assets/hero-background.png",
  heroFallback: "/assets/demo/arena-hero-glow.svg",
  cards: "/assets/demo/card-back-classic.svg",
  autographs: "/assets/demo/autograph-motif.svg",
  memorabilia: "/assets/demo/memorabilia-helmet.svg",
  tickets: "/assets/demo/ticket-stub.svg",
  vault: "/assets/demo/vault-panel.svg",
  arena: "/assets/demo/stadium-lights.svg",
  trading: "/assets/demo/card-stack.svg",
  collection: "/assets/demo/card-stack.svg",
  stadium: "/assets/demo/stadium-lights.svg",
  jersey: "/assets/demo/memorabilia-helmet.svg",
  display: "/assets/demo/memorabilia-helmet.svg",
  package: "/assets/demo/all-star-emblem.svg",
  handshake: "/assets/demo/collector-badge.svg",
  crowd: "/assets/demo/stadium-lights.svg",
  spotlight: "/assets/demo/arena-hero-glow.svg",
  vintage: "/assets/demo/memorabilia-bat.svg",
  grading: "/assets/demo/grade-label.svg",
  blog1: "/assets/demo/card-back-holographic.svg",
  blog2: "/assets/demo/mvp-emblem.svg",
  blog3: "/assets/demo/memorabilia-glove.svg",
  about1: "/assets/demo/collector-badge.svg",
  about2: "/assets/demo/grade-label.svg",
  about3: "/assets/demo/card-stack.svg",
  about4: "/assets/demo/arena-hero-glow.svg",
  about5: "/assets/demo/all-star-emblem.svg",
  about6: "/assets/demo/stadium-lights.svg",
  contact: "/assets/demo/ticket-texture.svg",
  pricing: "/assets/demo/trophy-silhouette.svg",
  services: "/assets/demo/vault-opens.svg",
} as const;

export function img(url: string, alt: string): ImageRef {
  return { url, alt };
}

export const HOMEPAGE_GALLERY: ImageRef[] = [
  img(BRAND_IMAGES.cards, "Premium sports cards under arena lights"),
  img(BRAND_IMAGES.autographs, "Authenticated autograph memorabilia"),
  img(BRAND_IMAGES.memorabilia, "Game-worn memorabilia display"),
  img(BRAND_IMAGES.tickets, "Premium event tickets"),
  img(BRAND_IMAGES.vault, "Secure collector vault storage"),
  img(BRAND_IMAGES.collection, "Curated collector showcase"),
];

export const ABOUT_GALLERY: ImageRef[] = [
  img(BRAND_IMAGES.about1, "Sodapops team at a card show"),
  img(BRAND_IMAGES.about2, "Inspecting graded cards"),
  img(BRAND_IMAGES.about3, "Trading desk setup"),
  img(BRAND_IMAGES.about4, "Arena-style display case"),
  img(BRAND_IMAGES.about5, "Collector community meetup"),
  img(BRAND_IMAGES.about6, "Championship memorabilia wall"),
];
