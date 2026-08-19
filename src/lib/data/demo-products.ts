import { BRAND_IMAGES } from "@/lib/images";

export interface DemoProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: { url: string; alt?: string }[];
  category?: string;
  stock?: number;
  featured?: boolean;
  onSale?: boolean;
}

/** Shown when MongoDB has no published products yet (before seed). */
export const DEMO_FEATURED_PRODUCTS: DemoProduct[] = [
  {
    _id: "demo-1",
    name: "Demo Rookie Card — Mint Raw",
    slug: "demo-rookie-card-mint",
    price: 24.99,
    compareAtPrice: 29.99,
    category: "Cards",
    stock: 12,
    featured: true,
    onSale: true,
    images: [{ url: BRAND_IMAGES.cards, alt: "Demo sports card" }],
  },
  {
    _id: "demo-2",
    name: "Demo Graded Card — PSA 9",
    slug: "demo-graded-card-psa9",
    price: 89.99,
    category: "Cards",
    stock: 3,
    featured: true,
    images: [{ url: BRAND_IMAGES.grading, alt: "Demo graded card" }],
  },
  {
    _id: "demo-3",
    name: "Demo Signed Photo — With COA",
    slug: "demo-signed-photo-coa",
    price: 149.99,
    category: "Autographs",
    stock: 2,
    featured: true,
    images: [{ url: BRAND_IMAGES.autographs, alt: "Demo autograph" }],
  },
  {
    _id: "demo-4",
    name: "Demo Display Mini Helmet",
    slug: "demo-display-mini-helmet",
    price: 59.99,
    category: "Memorabilia",
    stock: 8,
    images: [{ url: BRAND_IMAGES.memorabilia, alt: "Demo memorabilia" }],
  },
  {
    _id: "demo-5",
    name: "Demo Game-Used Style Bat",
    slug: "demo-game-used-bat",
    price: 199.99,
    category: "Memorabilia",
    stock: 1,
    featured: true,
    images: [{ url: BRAND_IMAGES.vintage, alt: "Demo bat memorabilia" }],
  },
  {
    _id: "demo-6",
    name: "Demo Event Ticket Listing",
    slug: "demo-event-ticket",
    price: 75.0,
    category: "Tickets",
    stock: 5,
    images: [{ url: BRAND_IMAGES.tickets, alt: "Demo event tickets" }],
  },
  {
    _id: "demo-7",
    name: "Demo Card Lot — 50 Count",
    slug: "demo-card-lot-50",
    price: 34.99,
    category: "Cards",
    stock: 20,
    onSale: true,
    images: [{ url: BRAND_IMAGES.collection, alt: "Demo card lot" }],
  },
  {
    _id: "demo-8",
    name: "Demo All-Star Surprise Pack",
    slug: "demo-all-star-pack",
    price: 50.0,
    category: "Packages",
    stock: 15,
    featured: true,
    images: [{ url: BRAND_IMAGES.package, alt: "Demo surprise pack" }],
  },
];
