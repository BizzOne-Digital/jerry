export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Pages", href: "/admin/pages", icon: "pages" },
  { label: "Services", href: "/admin/services", icon: "services" },
  { label: "Products", href: "/admin/products", icon: "products" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Pricing/Offers", href: "/admin/offers", icon: "offers" },
  { label: "Gallery", href: "/admin/gallery", icon: "gallery" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
  { label: "FAQs", href: "/admin/faqs", icon: "faqs" },
  { label: "Blogs", href: "/admin/blogs", icon: "blogs" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
] as const;

export type AdminNavItem = (typeof ADMIN_NAV)[number];
