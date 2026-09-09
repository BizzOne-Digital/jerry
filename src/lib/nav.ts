export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Collector Profile", href: "/questionnaire" },
  { label: "Contact", href: "/contact" },
] as const;

/** Primary header navigation — matches cinematic hero layout */
export const HEADER_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Sell & Trade", href: "/contact?inquiry=Trade" },
  { label: "Services", href: "/services" },
  { label: "Collector Profile", href: "/questionnaire" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_NAV = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Cards", href: "/shop?category=Cards" },
    { label: "Autographs", href: "/shop?category=Autographs" },
    { label: "Memorabilia", href: "/shop?category=Memorabilia" },
    { label: "Tickets", href: "/shop?category=Tickets" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Testimonials", href: "/testimonials" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "Collector Profile", href: "/questionnaire" },
    { label: "FAQs", href: "/faqs" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;