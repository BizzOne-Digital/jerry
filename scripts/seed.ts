import mongoose from "mongoose";
import { connectDB } from "../src/lib/db/connect";
import SiteSettings from "../src/models/SiteSettings";
import Page from "../src/models/Page";
import Service from "../src/models/Service";
import Offer from "../src/models/Offer";
import Product from "../src/models/Product";
import ProductCategory from "../src/models/ProductCategory";
import FAQ from "../src/models/FAQ";
import Testimonial from "../src/models/Testimonial";
import BlogPost from "../src/models/BlogPost";
import MediaCategory from "../src/models/MediaCategory";

function img(filename: string, alt: string) {
  return { url: `/assets/demo/${filename}`, alt };
}

function siteImg(filename: string, alt: string) {
  return { url: `/assets/site/${filename}`, alt };
}

async function seedSiteSettings() {
  await SiteSettings.updateOne(
    { singletonKey: "default" },
    {
      $set: {
        general: {
          companyName: "Sodapops Collectibles LLC",
          tagline: "Collect. Trade. Experience the Game.",
          announcementText:
            "New arrivals weekly · Affordable game tickets · Fair prices on graded cards and memorabilia",
          defaultSeoTitle: "Sodapops Collectibles | Sports Cards, Autographs & Game Tickets",
          defaultSeoDescription:
            "Your trusted source for sports collectibles, autographs, memorabilia, and affordable game tickets. Buy, sell, and trade with Sodapops Collectibles LLC.",
        },
        contact: {
          email: "sodascards@gmail.com",
          phone: "+1 (309) 278-2664",
          phoneLink: "tel:+13092782664",
          address: "Central Illinois, USA",
          businessHours: "Mon–Fri 10am–6pm CT · Sat 11am–4pm CT",
        },
        social: {
          instagram: "https://instagram.com/sodapopscollectibles",
          facebook: "https://facebook.com/sodapopscollectibles",
        },
        commerce: {
          currency: "USD",
          manualInvoiceInstructions:
            "After checkout, we will email payment instructions. Orders are processed once payment is confirmed.",
          shippingNotes: "Carefully packaged with tracking on all shipped orders.",
          returnNotes: "Contact us within 14 days for return eligibility on eligible items.",
          lowStockDefault: 3,
        },
        footer: {
          description:
            "Your trusted source for sports collectibles, autographs, memorabilia, and affordable game tickets.",
          newsletterCopy: "Get drop alerts, ticket opportunities, and collector tips in your inbox.",
          copyright: `© ${new Date().getFullYear()} Sodapops Collectibles LLC. All rights reserved.`,
        },
        motion: {
          enableIntro: true,
          introOncePerSession: true,
          normalIntensity: "normal",
          reducedIntensity: "low",
        },
      },
    },
    { upsert: true }
  );
  console.log("✓ SiteSettings");
}

async function seedPages() {
  const pages = [
    {
      key: "home",
      title: "Home",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "The Collector's Arena",
          heading: "Collect. Trade. Experience the Game.",
          subheading:
            "Your trusted source for sports collectibles, autographs, memorabilia, and affordable game tickets.",
          body: "Buy, sell, and trade collectible cards, authenticated autographs, sports memorabilia, and more.",
          cta: { label: "Shop Collectibles", href: "/shop" },
          secondaryCta: { label: "Sell or Trade", href: "/contact?inquiry=Sell" },
          image: siteImg("collector-triptych.jpg", "Grading, trading, and collecting"),
          backgroundImage: siteImg("hero-background.png", "Graded card and memorabilia in stadium lighting"),
        },
        {
          id: "ticker",
          type: "ticker",
          enabled: true,
          order: 1,
          items: [
            "Fresh card arrivals every week",
            "Affordable MLB & NFL ticket requests",
            "All-Star & MVP surprise packages in stock",
            "Authenticated autographs with documentation where applicable",
          ],
        },
        {
          id: "manifesto",
          type: "manifesto",
          enabled: true,
          order: 2,
          heading: "Buy it. Sell it. Trade it. Live it.",
          items: ["Buy it.", "Sell it.", "Trade it.", "Live it."],
          images: [
            siteImg("cards.jpg", "Buy collectible cards"),
            siteImg("trading-desk.jpg", "Sell your collection"),
            siteImg("treasure-chest.jpg", "Trade collectibles"),
            siteImg("tickets.jpg", "Experience live games"),
          ],
        },
        {
          id: "categories",
          type: "category-grid",
          enabled: true,
          order: 3,
          heading: "Featured Categories",
          items: ["Collectible Cards", "Authenticated Autographs", "Sports Memorabilia", "Game Tickets"],
          images: [
            siteImg("cards.jpg", "Collectible cards"),
            siteImg("autographs.jpg", "Authenticated autographs"),
            siteImg("memorabilia.jpg", "Sports memorabilia"),
            siteImg("tickets.jpg", "Game tickets"),
          ],
        },
        {
          id: "featured-products",
          type: "product-rail",
          enabled: true,
          order: 4,
          eyebrow: "New Arrivals",
          heading: "Featured Products",
          cta: { label: "View All", href: "/shop" },
        },
        {
          id: "vault-opens",
          type: "storytelling",
          enabled: true,
          order: 5,
          eyebrow: "The Vault Opens",
          heading: "Curated pieces for every collector",
          body: "From first-pack excitement to centerpiece displays, discover inventory chosen with condition transparency and fair pricing in mind.",
          image: siteImg("treasure-chest.jpg", "Curated collector showcase"),
          backgroundImage: siteImg("vault.jpg", "Secure collector vault storage"),
        },
        {
          id: "services-spotlight",
          type: "service-spotlight",
          enabled: true,
          order: 6,
          heading: "More than a shop",
          body: "Buy, sell, and trade collectible cards, authenticated autographs, sports memorabilia, and more. We also offer affordable tickets to MLB, NFL, and other major sporting events.",
          cta: { label: "Explore Services", href: "/services" },
          image: siteImg("trading-desk.jpg", "Expert collector services"),
        },
        {
          id: "offers",
          type: "offers-feature",
          enabled: true,
          order: 7,
          heading: "Special Packages",
          subheading: "Surprise assortments with clear guarantees where applicable.",
          images: [img("all-star-logo.png", "All-Star package"), img("mvp-logo.png", "MVP package")],
        },
        {
          id: "trust",
          type: "trust",
          enabled: true,
          order: 8,
          heading: "Why collectors choose Sodapops",
          items: [
            "Fair prices with clear condition notes",
            "Responsive support from real collectors",
            "Authentication documentation where applicable — never implied when absent",
            "Secure packaging and honest inventory counts",
          ],
          stats: [
            { label: "Categories", value: "5+" },
            { label: "Services", value: "6" },
            { label: "Support", value: "7 Days" },
          ],
          image: siteImg("card-sleeving.jpg", "Professional card handling"),
        },
        {
          id: "testimonials",
          type: "testimonial-reel",
          enabled: true,
          order: 9,
          heading: "Collector Stories",
          cta: { label: "Read Testimonials", href: "/testimonials" },
        },
        {
          id: "ticket-cta",
          type: "ticket-cta",
          enabled: true,
          order: 10,
          heading: "Experience the action live",
          body: "Affordable tickets to major sporting events — request seats without breaking the bank.",
          cta: { label: "Request Tickets", href: "/contact?inquiry=Tickets" },
          image: siteImg("tickets.jpg", "Premium event tickets"),
        },
        {
          id: "faq-preview",
          type: "faq-preview",
          enabled: true,
          order: 11,
          heading: "Common Questions",
          cta: { label: "View All FAQs", href: "/faqs" },
        },
        {
          id: "contact-finish",
          type: "contact-cta",
          enabled: true,
          order: 12,
          heading: "Ready to start collecting?",
          body: "Reach out for buying, selling, trading, or ticket inquiries.",
          cta: { label: "Contact Us", href: "/contact" },
          backgroundImage: siteImg("contact-desk.jpg", "Contact Sodapops Collectibles"),
        },
      ],
      seo: {
        title: "Sodapops Collectibles | Collect. Trade. Experience the Game.",
        description:
          "Sports collectibles, authenticated autographs, memorabilia, and affordable game tickets from Sodapops Collectibles LLC.",
        ogImage: siteImg("hero-background.png", "Sodapops Collectibles"),
      },
    },
    {
      key: "about",
      title: "About",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "Our Story",
          heading: "Built for the love of the game.",
          body: "Sodapops Collectibles LLC exists for collectors and fans who want fair dealing, clear condition information, and accessible live experiences.",
          image: siteImg("card-show-inspect.jpg", "Inspecting cards at a show"),
          backgroundImage: siteImg("hero-shop.jpg", "Premium collectibles boutique"),
        },
        {
          id: "mission",
          type: "content",
          enabled: true,
          order: 1,
          heading: "Our Mission",
          body: "Your trusted source for sports collectibles, autographs, memorabilia, and affordable game tickets. Whether you're a longtime collector, a sports fan, or just getting started, we make it easy to find great pieces at fair prices.",
        },
        {
          id: "timeline",
          type: "timeline",
          enabled: true,
          order: 2,
          heading: "From the first pack to the centerpiece",
          items: [
            "Discovering the hobby through packs and trades",
            "Learning condition grades and fair market values",
            "Building a collection with intentional pieces",
            "Sharing the live-game experience with affordable tickets",
          ],
          images: [img("card-stack.svg", "Card collection stack"), img("trophy-silhouette.svg", "Championship trophy silhouette")],
        },
        {
          id: "values",
          type: "values",
          enabled: true,
          order: 3,
          heading: "What we value",
          items: [
            "Fair dealing and transparent pricing",
            "Clear condition notes on every item",
            "Collector-first service and support",
            "Accessible live experiences through ticket requests",
          ],
          image: img("collector-badge.svg", "Collector verification badge"),
        },
        {
          id: "process",
          type: "process-strip",
          enabled: true,
          order: 4,
          heading: "Buy · Sell · Trade",
          items: ["Browse or inquire", "Review condition & pricing", "Complete your order or trade", "Enjoy your collection"],
          images: [img("card-back-classic.svg", "Trading card back"), img("autograph-motif.svg", "Autograph motif")],
        },
        {
          id: "montage",
          type: "image-montage",
          enabled: true,
          order: 5,
          heading: "Memorabilia that tells a story",
          images: [
            img("memorabilia-bat.svg", "Game-used bat silhouette"),
            img("memorabilia-glove.svg", "Fielding glove silhouette"),
            img("memorabilia-helmet.svg", "Display helmet silhouette"),
          ],
        },
        {
          id: "cta",
          type: "cta",
          enabled: true,
          order: 6,
          heading: "Join the Collector's Arena",
          cta: { label: "Shop Now", href: "/shop" },
          secondaryCta: { label: "Get in Touch", href: "/contact" },
          backgroundImage: img("vault-panel.svg", "Vault panel texture"),
        },
      ],
      seo: {
        title: "About Sodapops Collectibles",
        description: "Learn about Sodapops Collectibles LLC — fair dealing, clear condition notes, and collector-first service.",
        ogImage: img("stadium-lights.svg", "About Sodapops"),
      },
    },
    {
      key: "services",
      title: "Services",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "What We Offer",
          heading: "Services for every collector",
          body: "Buy, sell, and trade collectible cards, authenticated autographs, sports memorabilia, and more.",
          cta: { label: "Contact Us", href: "/contact" },
          backgroundImage: siteImg("trading-desk.jpg", "Expert collector services"),
          image: siteImg("card-photography.jpg", "Professional card photography"),
        },
        {
          id: "intro",
          type: "content",
          enabled: true,
          order: 1,
          body: "Whether you're a longtime collector, a sports fan, or just getting started, we make it easy to find great pieces at fair prices. And we don't stop at collectibles — we also offer affordable tickets to MLB, NFL, and other major sporting events.",
        },
        {
          id: "grid",
          type: "services-grid",
          enabled: true,
          order: 2,
          heading: "Our Services",
          metadata: { source: "services" },
        },
        {
          id: "process",
          type: "process-animation",
          enabled: true,
          order: 3,
          heading: "Buy · Sell · Trade · Live",
          items: ["Buy", "Sell", "Trade", "Live"],
          images: [
            img("card-back-holographic.svg", "Buy"),
            img("card-stack.svg", "Sell"),
            img("foil-sweep.svg", "Trade"),
            img("ticket-texture.svg", "Live"),
          ],
        },
        {
          id: "authenticity",
          type: "auth-explainer",
          enabled: true,
          order: 4,
          heading: "Authentication & transparency",
          body: "We clearly label authenticated items and provide documentation where applicable. Items without authentication records are never presented as verified.",
          image: img("grade-label.svg", "Condition and authentication label"),
        },
        {
          id: "tickets",
          type: "ticket-feature",
          enabled: true,
          order: 5,
          heading: "Affordable game tickets",
          body: "Request tickets to major sporting events at competitive prices.",
          cta: { label: "Request Tickets", href: "/contact?inquiry=Tickets" },
          image: img("ticket-stub.svg", "Game day ticket stub"),
        },
        {
          id: "faq-preview",
          type: "faq-preview",
          enabled: true,
          order: 6,
          heading: "Service FAQs",
          cta: { label: "All FAQs", href: "/faqs" },
        },
        {
          id: "cta",
          type: "contact-cta",
          enabled: true,
          order: 7,
          heading: "Let's talk collectibles",
          cta: { label: "Start an Inquiry", href: "/contact" },
          backgroundImage: img("stadium-lights.svg", "Stadium atmosphere"),
        },
      ],
      seo: {
        title: "Services | Sodapops Collectibles",
        description: "Buy, sell, trade cards, autographs, memorabilia, and request affordable game tickets.",
        ogImage: img("collector-badge.svg", "Services"),
      },
    },
    {
      key: "shop",
      title: "Shop",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "The Shop",
          heading: "Find your next centerpiece",
          body: "Browse cards, autographs, memorabilia, tickets, and surprise packages.",
          image: siteImg("cards.jpg", "Premium sports trading cards"),
          backgroundImage: siteImg("treasure-chest.jpg", "Curated collector showcase"),
        },
        {
          id: "intro",
          type: "content",
          enabled: true,
          order: 1,
          body: "Filter by category, condition, and price. Every product includes clear stock status and condition notes.",
        },
        {
          id: "catalog",
          type: "product-catalog",
          enabled: true,
          order: 2,
          metadata: { source: "products", showFilters: true },
        },
        {
          id: "trust",
          type: "trust",
          enabled: true,
          order: 3,
          heading: "Shop with confidence",
          items: ["Visible prices and stock counts", "Condition notes on every listing", "Secure checkout and manual invoice option"],
          image: img("grade-label.svg", "Grade label"),
        },
        {
          id: "cta",
          type: "cta",
          enabled: true,
          order: 4,
          heading: "Can't find what you're looking for?",
          cta: { label: "Request an Item", href: "/contact?inquiry=Buy" },
          image: img("card-stack.svg", "Card stack"),
        },
      ],
      seo: {
        title: "Shop Collectibles | Sodapops",
        description: "Shop sports cards, autographs, memorabilia, tickets, and collector packages.",
        ogImage: img("card-back-classic.svg", "Shop"),
      },
    },
    {
      key: "pricing",
      title: "Pricing",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "Special Offers",
          heading: "Surprise packages, clear guarantees",
          body: "All-Star and MVP packages with contents that vary by promotional event and sport.",
          backgroundImage: img("foil-sweep.svg", "Holographic foil sweep"),
          image: img("all-star-logo.png", "All-Star package emblem"),
        },
        {
          id: "comparison",
          type: "offer-comparison",
          enabled: true,
          order: 1,
          heading: "Choose your tier",
          metadata: { source: "offers" },
        },
        {
          id: "disclaimer",
          type: "content",
          enabled: true,
          order: 2,
          heading: "Variable contents notice",
          body: "Package contents vary by promotional event and sport. Available only while supplies last. Guaranteed items are listed on each package — we do not promise contents beyond those guarantees.",
        },
        {
          id: "gallery",
          type: "image-montage",
          enabled: true,
          order: 3,
          images: [
            img("mvp-logo.png", "MVP package"),
            img("card-stack.svg", "Card assortment"),
            img("autograph-motif.svg", "Autograph inclusion"),
            img("memorabilia-bat.svg", "Memorabilia piece"),
            img("trophy-silhouette.svg", "Championship collectible"),
          ],
        },
        {
          id: "faq",
          type: "faq-preview",
          enabled: true,
          order: 4,
          heading: "Package FAQs",
          cta: { label: "View FAQs", href: "/faqs" },
        },
        {
          id: "cta",
          type: "cta",
          enabled: true,
          order: 5,
          heading: "Ready to open a surprise?",
          cta: { label: "Request Package", href: "/contact?inquiry=Buy" },
          image: img("mvp-logo.png", "MVP emblem"),
        },
      ],
      seo: {
        title: "Pricing & Packages | Sodapops Collectibles",
        description: "All-Star ($50) and MVP ($100) surprise collectible packages with clear guarantees.",
        ogImage: img("mvp-logo.png", "Pricing"),
      },
    },
    {
      key: "testimonials",
      title: "Testimonials",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "Collector Voices",
          heading: "Stories from the hobby",
          body: "Demo testimonials below — replace with real customer feedback before launch.",
          backgroundImage: siteImg("family-packs.jpg", "Family opening card packs"),
          image: siteImg("team-show.jpg", "Sodapops team at a card show"),
        },
        {
          id: "slider",
          type: "testimonial-slider",
          enabled: true,
          order: 1,
          metadata: { source: "testimonials", featured: true },
        },
        {
          id: "wall",
          type: "testimonial-wall",
          enabled: true,
          order: 2,
          heading: "More collector experiences",
          metadata: { source: "testimonials" },
        },
        {
          id: "trust",
          type: "content",
          enabled: true,
          order: 3,
          heading: "Honest reviews matter",
          body: "We publish testimonials only with customer permission. Demo content is clearly labeled and must be replaced before launch.",
          image: img("grade-label.svg", "Trust badge detail"),
        },
        {
          id: "cta",
          type: "cta",
          enabled: true,
          order: 4,
          heading: "Start your own collector story",
          cta: { label: "Shop Collectibles", href: "/shop" },
          secondaryCta: { label: "Contact Us", href: "/contact" },
          images: [img("card-back-classic.svg", "Cards"), img("ticket-stub.svg", "Tickets")],
        },
      ],
      seo: {
        title: "Testimonials | Sodapops Collectibles",
        description: "Collector stories and demo testimonials from Sodapops Collectibles.",
        ogImage: img("collector-badge.svg", "Testimonials"),
      },
    },
    {
      key: "faqs",
      title: "FAQs",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "Help Center",
          heading: "Frequently Asked Questions",
          body: "Searchable answers about buying, selling, trading, authenticity, tickets, and shipping.",
          backgroundImage: siteImg("vault.jpg", "Secure collector vault"),
          image: siteImg("faq-question.jpg", "Collector questions answered"),
        },
        {
          id: "accordion",
          type: "faq-accordion",
          enabled: true,
          order: 1,
          metadata: { source: "faqs", searchable: true },
        },
        {
          id: "collage",
          type: "image-montage",
          enabled: true,
          order: 2,
          images: [
            img("autograph-motif.svg", "Autograph FAQ"),
            img("ticket-texture.svg", "Ticket FAQ"),
            img("memorabilia-glove.svg", "Memorabilia FAQ"),
            img("foil-sweep.svg", "Package FAQ"),
            img("grade-label.svg", "Condition FAQ"),
          ],
        },
        {
          id: "cta",
          type: "contact-cta",
          enabled: true,
          order: 3,
          heading: "Still have a question?",
          body: "Our team is happy to help with any collector inquiry.",
          cta: { label: "Contact Us", href: "/contact" },
        },
      ],
      seo: {
        title: "FAQs | Sodapops Collectibles",
        description: "Answers to common questions about sports collectibles, tickets, and packages.",
        ogImage: img("grade-label.svg", "FAQs"),
      },
    },
    {
      key: "contact",
      title: "Contact",
      sections: [
        {
          id: "hero",
          type: "hero",
          enabled: true,
          order: 0,
          eyebrow: "Get in Touch",
          heading: "We're here to help collectors",
          body: "Reach out for buying, selling, trading, autographs, memorabilia, tickets, or order support.",
          backgroundImage: siteImg("contact-desk.jpg", "Contact Sodapops Collectibles"),
          image: siteImg("trading-desk.jpg", "Expert collector consultation"),
        },
        {
          id: "form",
          type: "contact-form",
          enabled: true,
          order: 1,
          metadata: {
            inquiryTypes: ["Buy", "Sell", "Trade", "Autograph", "Memorabilia", "Tickets", "Order Support", "Other"],
          },
        },
        {
          id: "details",
          type: "contact-details",
          enabled: true,
          order: 2,
          heading: "Contact Information",
          metadata: { source: "settings" },
        },
        {
          id: "collage",
          type: "image-montage",
          enabled: true,
          order: 3,
          images: [
            img("vault-panel.svg", "Vault detail"),
            img("stadium-lights.svg", "Stadium detail"),
            img("ticket-stub.svg", "Ticket detail"),
            img("card-stack.svg", "Card detail"),
            img("broadcast-wipe.svg", "Broadcast detail"),
          ],
        },
        {
          id: "hours",
          type: "content",
          enabled: true,
          order: 4,
          heading: "Business Hours",
          body: "Mon–Fri 10am–6pm CT · Sat 11am–4pm CT",
          image: img("ticket-texture.svg", "Ticket texture accent"),
        },
      ],
      seo: {
        title: "Contact | Sodapops Collectibles",
        description: "Contact Sodapops Collectibles at sodascards@gmail.com or +1 (309) 278-2664.",
        ogImage: img("ticket-stub.svg", "Contact"),
      },
    },
  ];

  for (const page of pages) {
    await Page.updateOne(
      { key: page.key },
      { $set: { ...page, status: "published" } },
      { upsert: true }
    );
  }
  console.log(`✓ Pages (${pages.length})`);
}

async function seedServices() {
  const services = [
    {
      title: "Buy Collectible Cards",
      slug: "buy-collectible-cards",
      shortDescription: "Find graded, raw, and vintage cards at fair prices with clear condition notes.",
      cardImage: siteImg("cards.jpg", "Premium sports trading cards"),
      iconAccent: "gold",
      ctaLabel: "Browse Cards",
      sortOrder: 0,
      detailHero: {
        eyebrow: "Collectible Cards",
        heading: "Build your lineup card by card",
        subheading: "From rookie gems to vintage staples — curated inventory with transparent grading and pricing.",
        image: img("card-back-classic.svg", "Classic card back design"),
        backgroundImage: img("foil-sweep.svg", "Foil sweep accent"),
      },
      overview:
        "Whether you're chasing a grail card or filling out a set, our buying experience is built for collectors who value condition transparency and fair market pricing. Every listing includes clear notes on grade, sleeve status, and any imperfections.",
      benefits: [
        "Wide range of sports and eras",
        "Clear condition descriptions",
        "Fair pricing with visible compare-at values where applicable",
        "Secure packaging on every order",
      ],
      processSteps: [
        { title: "Browse the shop", description: "Filter by category, price, and condition.", image: img("card-stack.svg", "Browse cards") },
        { title: "Review details", description: "Check photos, grade notes, and stock status.", image: img("grade-label.svg", "Review condition") },
        { title: "Add to cart", description: "Server-validated pricing at checkout.", image: img("card-back-holographic.svg", "Add to cart") },
        { title: "Receive your cards", description: "Carefully packaged with tracking.", image: img("collector-badge.svg", "Delivery") },
      ],
      importantNotes: [
        "Authentication status is listed per item — not all cards include third-party grading.",
        "High-demand items may sell quickly; stock counts are updated in real time.",
      ],
      serviceFaqs: [
        { question: "Do you sell graded cards?", answer: "Yes, when available. Grade and grading company are listed on each product." },
        { question: "Can I request a specific card?", answer: "Absolutely — use the contact form with inquiry type Buy and describe what you're looking for." },
      ],
      detailImages: [
        img("card-back-classic.svg", "Card back"),
        img("card-back-holographic.svg", "Holo card"),
        img("card-stack.svg", "Card stack"),
        img("foil-sweep.svg", "Foil detail"),
        img("grade-label.svg", "Grade label"),
      ],
      featureSection: {
        heading: "The Collector's Arena difference",
        body: "We treat every card like it belongs in a personal vault — because it does.",
        image: img("vault-opens.svg", "Vault opens"),
      },
      cta: { label: "Shop Cards", href: "/shop?category=Cards" },
      seo: {
        title: "Buy Collectible Cards | Sodapops",
        description: "Shop sports collectible cards with clear condition notes and fair pricing.",
        ogImage: img("card-back-holographic.svg", "Buy cards"),
      },
    },
    {
      title: "Sell Your Collection",
      slug: "sell-your-collection",
      shortDescription: "Turn your collection into cash with a straightforward evaluation and offer process.",
      cardImage: siteImg("trading-desk.jpg", "Selling your collection"),
      iconAccent: "blue",
      ctaLabel: "Start Selling",
      sortOrder: 1,
      detailHero: {
        eyebrow: "Sell",
        heading: "Your collection deserves a fair offer",
        subheading: "From single cards to entire binders — we make selling simple and transparent.",
        image: img("vault-panel.svg", "Vault evaluation panel"),
        backgroundImage: img("broadcast-wipe.svg", "Broadcast accent"),
      },
      overview:
        "Ready to downsize, fund a new chase card, or convert duplicates into cash? Our sell process starts with a conversation about what you have, its condition, and current market demand.",
      benefits: [
        "Straightforward evaluation process",
        "Fair offers based on current market data",
        "Flexible options for small lots or large collections",
        "Clear communication throughout",
      ],
      processSteps: [
        { title: "Submit your list", description: "Contact us with photos and descriptions of items.", image: img("card-stack.svg", "Submit list") },
        { title: "Receive evaluation", description: "We review condition and market comparables.", image: img("grade-label.svg", "Evaluation") },
        { title: "Review offer", description: "Accept, counter, or ask questions — no pressure.", image: img("collector-badge.svg", "Review offer") },
        { title: "Complete the sale", description: "Ship or drop off per agreed terms.", image: img("vault-opens.svg", "Complete sale") },
      ],
      importantNotes: [
        "Offers depend on condition, demand, and completeness of information provided.",
        "We do not provide appraisals for insurance or legal purposes.",
      ],
      serviceFaqs: [
        { question: "How do I get started?", answer: "Use the contact form with inquiry type Sell and include photos where possible." },
        { question: "Do you buy ungraded cards?", answer: "Yes — condition notes help us provide accurate offers." },
      ],
      detailImages: [
        img("card-stack.svg", "Collection stack"),
        img("vault-panel.svg", "Vault"),
        img("grade-label.svg", "Condition"),
        img("card-back-classic.svg", "Card back"),
        img("foil-sweep.svg", "Foil"),
      ],
      featureSection: {
        heading: "Respect for your hobby",
        body: "We've been on both sides of the table — your cards are handled with care from first photo to final payment.",
        image: img("memorabilia-bat.svg", "Memorabilia accent"),
      },
      cta: { label: "Sell Your Collection", href: "/contact?inquiry=Sell" },
      seo: {
        title: "Sell Your Collection | Sodapops",
        description: "Sell sports cards and collectibles with fair evaluation and transparent offers.",
        ogImage: img("card-stack.svg", "Sell collection"),
      },
    },
    {
      title: "Trade Collectibles",
      slug: "trade-collectibles",
      shortDescription: "Swap cards and memorabilia with value-balanced trades tailored to your goals.",
      cardImage: siteImg("collector-triptych.jpg", "Trading collectibles"),
      iconAccent: "red",
      ctaLabel: "Propose a Trade",
      sortOrder: 2,
      detailHero: {
        eyebrow: "Trade",
        heading: "Upgrade your collection through smart trades",
        subheading: "Value-balanced swaps for collectors who want fresh inventory without cashing out.",
        image: img("card-back-holographic.svg", "Trade cards"),
        backgroundImage: img("arena-hero-glow.svg", "Arena glow"),
      },
      overview:
        "Trading is the heartbeat of the hobby. Whether you're looking to consolidate, diversify, or chase a specific piece, we facilitate trades with clear value assessments on both sides.",
      benefits: [
        "Balanced value assessments",
        "Flexible trade structures",
        "Support for cards, memorabilia, and mixed lots",
        "Clear documentation of trade terms",
      ],
      processSteps: [
        { title: "Share your trade idea", description: "Tell us what you have and what you want.", image: img("card-stack.svg", "Trade idea") },
        { title: "Value assessment", description: "Both sides evaluated on condition and market.", image: img("grade-label.svg", "Assessment") },
        { title: "Agree on terms", description: "Confirm items, any cash adjustment, and shipping.", image: img("collector-badge.svg", "Terms") },
        { title: "Execute the trade", description: "Items shipped or exchanged per agreement.", image: img("foil-sweep.svg", "Execute") },
      ],
      importantNotes: [
        "Trade values are estimates based on current market conditions and may fluctuate.",
        "All trades require mutual agreement before any items are shipped.",
      ],
      serviceFaqs: [
        { question: "Can I trade memorabilia for cards?", answer: "Yes — mixed-media trades are welcome. Share photos and descriptions for accurate assessment." },
        { question: "Is there a minimum trade value?", answer: "No strict minimum, but both sides should have clear value for a balanced trade." },
      ],
      detailImages: [
        img("foil-sweep.svg", "Foil"),
        img("card-back-holographic.svg", "Holo card"),
        img("card-stack.svg", "Stack"),
        img("vault-opens.svg", "Vault"),
        img("collector-badge.svg", "Badge"),
      ],
      featureSection: {
        heading: "Trade smarter",
        body: "The right trade can transform a good collection into a great one.",
        image: img("trophy-silhouette.svg", "Trophy"),
      },
      cta: { label: "Start a Trade", href: "/contact?inquiry=Trade" },
      seo: {
        title: "Trade Collectibles | Sodapops",
        description: "Trade sports cards and memorabilia with value-balanced assessments.",
        ogImage: img("foil-sweep.svg", "Trade"),
      },
    },
    {
      title: "Authenticated Autographs",
      slug: "authenticated-autographs",
      shortDescription: "Signed memorabilia with documentation where applicable — clearly labeled on every item.",
      cardImage: siteImg("autographs.jpg", "Authenticated autographs"),
      iconAccent: "gold",
      ctaLabel: "View Autographs",
      sortOrder: 3,
      detailHero: {
        eyebrow: "Autographs",
        heading: "Signatures with substance",
        subheading: "Authenticated autographs with COA references where applicable — never implied when absent.",
        image: img("autograph-motif.svg", "Autograph display"),
        backgroundImage: img("vault-panel.svg", "Vault background"),
      },
      overview:
        "Autographed items are among the most personal pieces in any collection. We source signed memorabilia with clear authentication status and provide COA references when documentation is available.",
      benefits: [
        "Clear authentication labels on every item",
        "COA references where documentation exists",
        "Photos showing signature placement and condition",
        "Never implied authentication on unsigned items",
      ],
      processSteps: [
        { title: "Browse authenticated items", description: "Filter shop by Autographs category.", image: img("autograph-motif.svg", "Browse") },
        { title: "Review documentation", description: "Check COA reference and signature photos.", image: img("grade-label.svg", "Documentation") },
        { title: "Purchase or inquire", description: "Add to cart or request similar items.", image: img("collector-badge.svg", "Purchase") },
        { title: "Display with confidence", description: "Receive with protective packaging.", image: img("vault-opens.svg", "Display") },
      ],
      importantNotes: [
        "Authentication status varies by item — check each listing for COA details.",
        "We do not guarantee future value appreciation of autographed items.",
      ],
      serviceFaqs: [
        { question: "How do I know an item is authenticated?", answer: "Each listing clearly states authentication status and includes COA reference when available." },
        { question: "Can I request a specific athlete's autograph?", answer: "Yes — submit a contact inquiry with inquiry type Autograph." },
      ],
      detailImages: [
        img("autograph-motif.svg", "Autograph"),
        img("grade-label.svg", "COA label"),
        img("vault-panel.svg", "Vault"),
        img("card-back-classic.svg", "Signed card"),
        img("collector-badge.svg", "Badge"),
      ],
      featureSection: {
        heading: "Trust the signature",
        body: "Every autograph listing tells you exactly what documentation is included — no surprises.",
        image: img("memorabilia-helmet.svg", "Signed memorabilia"),
      },
      cta: { label: "Shop Autographs", href: "/shop?category=Autographs" },
      seo: {
        title: "Authenticated Autographs | Sodapops",
        description: "Shop authenticated sports autographs with clear documentation.",
        ogImage: img("autograph-motif.svg", "Autographs"),
      },
    },
    {
      title: "Sports Memorabilia",
      slug: "sports-memorabilia",
      shortDescription: "Game-used style pieces, display items, and collectible memorabilia for your showcase.",
      cardImage: siteImg("memorabilia.jpg", "Sports memorabilia display"),
      iconAccent: "blue",
      ctaLabel: "Browse Memorabilia",
      sortOrder: 4,
      detailHero: {
        eyebrow: "Memorabilia",
        heading: "Pieces that belong in your showcase",
        subheading: "From display helmets to game-used style items — curated memorabilia with honest descriptions.",
        image: img("memorabilia-bat.svg", "Memorabilia bat silhouette"),
        backgroundImage: img("stadium-lights.svg", "Stadium atmosphere"),
      },
      overview:
        "Memorabilia brings the game into your space. We offer display pieces and collectible memorabilia with clear condition notes and provenance information where available.",
      benefits: [
        "Curated display and collectible pieces",
        "Honest condition and provenance notes",
        "Secure shipping for fragile items",
        "Authentication labels where applicable",
      ],
      processSteps: [
        { title: "Explore the collection", description: "Browse memorabilia in our shop.", image: img("memorabilia-helmet.svg", "Explore") },
        { title: "Check condition notes", description: "Review photos and descriptions carefully.", image: img("grade-label.svg", "Condition") },
        { title: "Order with confidence", description: "Fragile items receive extra packaging.", image: img("vault-panel.svg", "Order") },
        { title: "Showcase your piece", description: "Display tips available on request.", image: img("trophy-silhouette.svg", "Showcase") },
      ],
      importantNotes: [
        "Game-used status is listed per item — not all memorabilia is game-used.",
        "Large or fragile items may require special shipping arrangements.",
      ],
      serviceFaqs: [
        { question: "Do you authenticate memorabilia?", answer: "Authentication status is listed per item. We never imply verification without documentation." },
        { question: "Can you source specific memorabilia?", answer: "Submit an inquiry and we'll let you know if we can locate the piece." },
      ],
      detailImages: [
        img("memorabilia-bat.svg", "Bat"),
        img("memorabilia-glove.svg", "Glove"),
        img("memorabilia-helmet.svg", "Helmet"),
        img("trophy-silhouette.svg", "Trophy"),
        img("vault-opens.svg", "Vault"),
      ],
      featureSection: {
        heading: "Your personal hall of fame",
        body: "The right memorabilia piece transforms a room into a collector's sanctuary.",
        image: img("arena-hero-glow.svg", "Arena display"),
      },
      cta: { label: "Shop Memorabilia", href: "/shop?category=Memorabilia" },
      seo: {
        title: "Sports Memorabilia | Sodapops",
        description: "Shop sports memorabilia with clear condition notes and honest descriptions.",
        ogImage: img("memorabilia-helmet.svg", "Memorabilia"),
      },
    },
    {
      title: "Affordable Game Tickets",
      slug: "affordable-game-tickets",
      shortDescription: "Request affordable tickets to MLB, NFL, and other major sporting events.",
      cardImage: siteImg("tickets.jpg", "Affordable game tickets"),
      iconAccent: "red",
      ctaLabel: "Request Tickets",
      sortOrder: 5,
      detailHero: {
        eyebrow: "Live Events",
        heading: "Experience the game in person",
        subheading: "Affordable tickets to major sporting events — because collecting isn't only about what fits in a binder.",
        image: img("ticket-stub.svg", "Game day ticket stub"),
        backgroundImage: img("stadium-lights.svg", "Stadium lights"),
      },
      overview:
        "Nothing replaces the energy of a live game. We help collectors and fans find affordable tickets to MLB, NFL, and other major sporting events through our ticket request service.",
      benefits: [
        "Competitive pricing on major events",
        "MLB, NFL, and other sporting events",
        "Personal assistance finding the right seats",
        "No hidden fees in our request process",
      ],
      processSteps: [
        { title: "Submit a request", description: "Tell us the event, date, and budget.", image: img("ticket-texture.svg", "Request") },
        { title: "Receive options", description: "We'll find available seats in your range.", image: img("ticket-stub.svg", "Options") },
        { title: "Confirm and pay", description: "Secure your tickets through our checkout.", image: img("collector-badge.svg", "Confirm") },
        { title: "Enjoy the game", description: "Experience the action live.", image: img("stadium-lights.svg", "Game day") },
      ],
      importantNotes: [
        "Ticket availability varies by event and is not guaranteed until confirmed.",
        "Prices fluctuate based on demand, seat location, and event date.",
        "We do not guarantee specific teams, sections, or views unless confirmed in writing.",
      ],
      serviceFaqs: [
        { question: "Which sports do you cover?", answer: "Primarily MLB and NFL, plus other major sporting events as available." },
        { question: "How far in advance should I request?", answer: "Earlier is better for popular matchups, but we accept requests for upcoming events." },
      ],
      detailImages: [
        img("ticket-texture.svg", "Ticket texture"),
        img("ticket-stub.svg", "Ticket stub"),
        img("stadium-lights.svg", "Stadium"),
        img("broadcast-wipe.svg", "Broadcast"),
        img("arena-hero-glow.svg", "Arena"),
      ],
      featureSection: {
        heading: "Live it",
        body: "The fourth word in our manifesto — because the best collectors also love the live game.",
        image: img("ticket-stub.svg", "Game day"),
      },
      cta: { label: "Request Tickets", href: "/contact?inquiry=Tickets" },
      seo: {
        title: "Affordable Game Tickets | Sodapops",
        description: "Request affordable tickets to MLB, NFL, and major sporting events.",
        ogImage: img("ticket-stub.svg", "Tickets"),
      },
    },
  ];

  for (const service of services) {
    await Service.updateOne(
      { slug: service.slug },
      { $set: { ...service, status: "published" } },
      { upsert: true }
    );
  }

  const allServices = await Service.find({ status: "published" }).sort({ sortOrder: 1 });
  const relatedIds = allServices.map((s) => s._id);

  for (const service of allServices) {
    const others = relatedIds.filter((id) => !id.equals(service._id));
    await Service.updateOne({ _id: service._id }, { $set: { relatedServiceIds: others.slice(0, 3) } });
  }

  console.log(`✓ Services (${services.length})`);
}

async function seedOffers() {
  const offers = [
    {
      name: "All-Star Package",
      slug: "all-star",
      price: 50,
      summary: "A surprise assortment that may include random card packs, graded cards, limited autographs, and other event- or sport-specific collectibles.",
      includedItems: [
        "Random card packs",
        "Graded cards (when available)",
        "Limited autographs (when available)",
        "Event- or sport-specific collectibles",
      ],
      guaranteedItems: [],
      variableDisclaimer:
        "Contents vary by promotional event and sport. Available only while supplies last. No specific items are guaranteed beyond the assortment description.",
      sportEventLabel: "Multi-sport promotional event",
      inventory: 25,
      availability: "available",
      ctaLabel: "Request All-Star Package",
      ctaHref: "/contact?inquiry=Buy&product=all-star",
      images: [
        img("all-star-logo.png", "All-Star package emblem"),
        img("card-stack.svg", "Card assortment"),
        img("card-back-holographic.svg", "Holographic card"),
        img("foil-sweep.svg", "Foil sweep"),
        img("autograph-motif.svg", "Possible autograph"),
      ],
      featured: true,
      sortOrder: 0,
      seo: {
        title: "All-Star Package — $50 | Sodapops",
        description: "Surprise collectible assortment for $50. Contents vary by event and sport.",
        ogImage: img("all-star-logo.png", "All-Star Package"),
      },
    },
    {
      name: "MVP Package",
      slug: "mvp",
      price: 100,
      summary: "A 100+ card package with a guaranteed minimum of one autograph, plus possible figures, graded cards, and event-specific collectibles.",
      includedItems: [
        "100+ cards",
        "Possible graded cards",
        "Possible figures",
        "Event- or sport-specific collectibles",
      ],
      guaranteedItems: ["Minimum of one autograph"],
      variableDisclaimer:
        "Contents vary by promotional event and sport. Available only while supplies last. Guaranteed items are listed above — no additional contents are promised.",
      sportEventLabel: "Multi-sport promotional event",
      inventory: 15,
      availability: "available",
      ctaLabel: "Request MVP Package",
      ctaHref: "/contact?inquiry=Buy&product=mvp",
      images: [
        img("mvp-logo.png", "MVP package emblem"),
        img("card-stack.svg", "100+ card stack"),
        img("autograph-motif.svg", "Guaranteed autograph"),
        img("grade-label.svg", "Graded card possibility"),
        img("trophy-silhouette.svg", "Bonus collectible"),
      ],
      featured: true,
      sortOrder: 1,
      seo: {
        title: "MVP Package — $100 | Sodapops",
        description: "100+ card package with guaranteed autograph for $100. Contents vary by event and sport.",
        ogImage: img("mvp-logo.png", "MVP Package"),
      },
    },
  ];

  for (const offer of offers) {
    await Offer.updateOne(
      { slug: offer.slug },
      { $set: { ...offer, status: "published", currency: "USD" } },
      { upsert: true }
    );
  }
  console.log(`✓ Offers (${offers.length})`);
}

async function seedProductCategories() {
  const categories = [
    { name: "Cards", slug: "cards", description: "Graded, raw, and vintage sports cards", sortOrder: 0 },
    { name: "Autographs", slug: "autographs", description: "Authenticated signed memorabilia", sortOrder: 1 },
    { name: "Memorabilia", slug: "memorabilia", description: "Display pieces and collectible memorabilia", sortOrder: 2 },
    { name: "Tickets", slug: "tickets", description: "Event ticket listings and requests", sortOrder: 3 },
    { name: "Packages", slug: "packages", description: "Surprise assortment packages", sortOrder: 4 },
  ];

  for (const category of categories) {
    await ProductCategory.updateOne(
      { slug: category.slug },
      { $set: { ...category, status: "published" } },
      { upsert: true }
    );
  }
  console.log(`✓ ProductCategories (${categories.length})`);
}

async function seedProducts() {
  const products = [
    {
      name: "Demo Rookie Card — Mint Raw",
      slug: "demo-rookie-card-mint",
      sku: "DEMO-CARD-001",
      category: "Cards",
      tags: ["demo", "rookie", "raw"],
      shortDescription: "Demo listing — replace with real inventory before launch.",
      longDescription: "A demo sports card listing for development and design purposes. Condition: Near Mint. Not affiliated with any specific league or team.",
      price: 24.99,
      compareAtPrice: 29.99,
      stock: 12,
      condition: "Near Mint",
      conditionNotes: "Corners sharp, centering 55/45. Stored in penny sleeve and top loader.",
      isAuthenticated: false,
      images: [
        siteImg("cards.jpg", "Sports trading card"),
        siteImg("card-marble.jpg", "Premium card on marble"),
        siteImg("card-sleeving.jpg", "Card protection"),
        siteImg("treasure-chest.jpg", "Collector showcase"),
        siteImg("graded-pedestal.jpg", "Graded display"),
      ],
      featured: true,
      onSale: true,
    },
    {
      name: "Demo Graded Card — PSA 9",
      slug: "demo-graded-card-psa9",
      sku: "DEMO-CARD-002",
      category: "Cards",
      tags: ["demo", "graded", "psa"],
      shortDescription: "Demo graded card listing with slab presentation.",
      longDescription: "Demo graded card for storefront development. PSA 9 equivalent presentation — replace with authenticated inventory before launch.",
      price: 89.99,
      stock: 3,
      lowStockThreshold: 3,
      condition: "Graded PSA 9",
      isAuthenticated: false,
      images: [
        siteImg("graded-pedestal.jpg", "Graded card on pedestal"),
        siteImg("card-sleeving.jpg", "Professional card handling"),
        siteImg("vault.jpg", "Secure vault storage"),
        siteImg("cards.jpg", "Trading card detail"),
        siteImg("card-show-inspect.jpg", "Card inspection"),
      ],
      featured: true,
    },
    {
      name: "Demo Signed Photo — With COA",
      slug: "demo-signed-photo-coa",
      sku: "DEMO-AUTO-001",
      category: "Autographs",
      tags: ["demo", "autograph", "coa"],
      shortDescription: "Demo authenticated autograph with COA reference.",
      longDescription: "Demo autographed photo listing. Includes COA reference for demonstration purposes. Replace with verified inventory before launch.",
      price: 149.99,
      stock: 2,
      condition: "Excellent",
      isAuthenticated: true,
      coaReference: "DEMO-COA-2026-001",
      images: [
        siteImg("autographs.jpg", "Authenticated autograph"),
        siteImg("card-photography.jpg", "Autograph photography"),
        siteImg("trading-desk.jpg", "Expert consultation"),
        siteImg("memorabilia.jpg", "Collectibles display"),
        siteImg("card-marble.jpg", "Premium presentation"),
      ],
      featured: true,
    },
    {
      name: "Demo Display Mini Helmet",
      slug: "demo-display-mini-helmet",
      sku: "DEMO-MEM-001",
      category: "Memorabilia",
      tags: ["demo", "helmet", "display"],
      shortDescription: "Demo display mini helmet for showcase collections.",
      longDescription: "Generic display mini helmet for demo purposes. No team or league affiliation. Replace before launch.",
      price: 59.99,
      stock: 8,
      condition: "New — Display",
      isAuthenticated: false,
      images: [
        siteImg("memorabilia.jpg", "Display memorabilia"),
        siteImg("memorabilia-wall.jpg", "Memorabilia wall display"),
        siteImg("hero-shop.jpg", "Premium collectibles boutique"),
        siteImg("team-show.jpg", "Team at card show"),
        siteImg("collector-triptych.jpg", "Collector experience"),
      ],
      featured: false,
    },
    {
      name: "Demo Game-Used Style Bat",
      slug: "demo-game-used-bat",
      sku: "DEMO-MEM-002",
      category: "Memorabilia",
      tags: ["demo", "bat", "game-used-style"],
      shortDescription: "Demo game-used style bat silhouette piece.",
      longDescription: "Demo memorabilia bat listing. Game-used style — not verified game-used. Replace with authenticated inventory before launch.",
      price: 199.99,
      stock: 1,
      lowStockThreshold: 2,
      condition: "Good — Display",
      conditionNotes: "Minor surface wear consistent with display use.",
      isAuthenticated: false,
      images: [
        siteImg("memorabilia-wall.jpg", "Game-used style memorabilia"),
        siteImg("card-marble.jpg", "Vintage collectible presentation"),
        siteImg("memorabilia.jpg", "Sports memorabilia display"),
        siteImg("treasure-chest.jpg", "Collector treasure"),
        siteImg("vault.jpg", "Vault storage"),
      ],
      featured: true,
    },
    {
      name: "Demo Event Ticket Listing",
      slug: "demo-event-ticket",
      sku: "DEMO-TIX-001",
      category: "Tickets",
      tags: ["demo", "tickets", "event"],
      shortDescription: "Demo ticket listing — request-based availability.",
      longDescription: "Demo ticket product for storefront development. Actual availability varies by event. Submit a ticket request for current options.",
      price: 75.0,
      stock: 5,
      condition: "Electronic Transfer",
      isAuthenticated: false,
      images: [
        siteImg("tickets.jpg", "Premium event tickets"),
        siteImg("packages-gift.jpg", "Event package"),
        siteImg("collector-triptych.jpg", "Live game experience"),
        siteImg("team-show.jpg", "Sports event atmosphere"),
        siteImg("hero-shop.jpg", "Collectibles boutique"),
      ],
      featured: false,
    },
    {
      name: "All-Star Surprise Package",
      slug: "all-star-surprise-package",
      sku: "PKG-ALLSTAR-001",
      category: "Packages",
      tags: ["package", "all-star", "surprise"],
      shortDescription: "The $50 All-Star surprise assortment — contents vary.",
      longDescription: "A surprise assortment that may include random card packs, graded cards, limited autographs, and other collectibles. Contents vary by promotional event and sport.",
      price: 50.0,
      stock: 25,
      condition: "New — Sealed",
      isAuthenticated: false,
      images: [
        img("all-star-logo.png", "All-Star emblem"),
        siteImg("packages-gift.jpg", "Surprise package"),
        siteImg("treasure-chest.jpg", "Card assortment"),
        siteImg("cards.jpg", "Trading cards"),
        siteImg("autographs.jpg", "Possible autograph"),
      ],
      featured: true,
    },
    {
      name: "MVP Card Package",
      slug: "mvp-card-package",
      sku: "PKG-MVP-001",
      category: "Packages",
      tags: ["package", "mvp", "autograph"],
      shortDescription: "100+ cards with guaranteed minimum of one autograph.",
      longDescription: "A 100+ card package with a guaranteed minimum of one autograph. May also include figures, graded cards, and event-specific collectibles. Contents vary.",
      price: 100.0,
      stock: 15,
      condition: "New — Sealed",
      isAuthenticated: false,
      images: [
        img("mvp-logo.png", "MVP emblem"),
        siteImg("packages-gift.jpg", "Premium package"),
        siteImg("treasure-chest.jpg", "100+ card assortment"),
        siteImg("graded-pedestal.jpg", "Graded card possibility"),
        siteImg("autographs.jpg", "Guaranteed autograph"),
      ],
      featured: true,
    },
  ];

  for (const product of products) {
    await Product.updateOne(
      { slug: product.slug },
      { $set: { ...product, status: "published", currency: "USD" } },
      { upsert: true }
    );
  }
  console.log(`✓ Products (${products.length})`);
}

async function seedFaqs() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our shop, add items to your cart, and complete checkout. We accept manual invoice payment by default, with optional Stripe checkout when configured.",
      category: "Buying",
      relatedPageKey: "shop",
      sortOrder: 0,
    },
    {
      question: "What payment methods do you accept?",
      answer: "Our default payment option is manual invoice / payment arrangement. Stripe Checkout is available when configured with valid environment credentials.",
      category: "Buying",
      sortOrder: 1,
    },
    {
      question: "How do I sell my collection?",
      answer: "Use the contact form with inquiry type Sell. Include photos and descriptions of your items for the fastest evaluation.",
      category: "Selling",
      relatedPageKey: "contact",
      sortOrder: 0,
    },
    {
      question: "How does trading work?",
      answer: "Submit a trade proposal via the contact form. We'll assess value on both sides and propose balanced terms for your approval.",
      category: "Trading",
      sortOrder: 0,
    },
    {
      question: "Are all autographs authenticated?",
      answer: "No. Authentication status is listed on each individual item. Items with documentation include COA references. We never imply authentication when it is not documented.",
      category: "Authenticity",
      sortOrder: 0,
    },
    {
      question: "How do I request game tickets?",
      answer: "Submit a contact inquiry with type Tickets. Include the event, preferred date, and budget range. We'll respond with available options.",
      category: "Tickets",
      relatedPageKey: "contact",
      sortOrder: 0,
    },
    {
      question: "What are your shipping policies?",
      answer: "All shipped orders include tracking. Cards are sent in protective sleeves and top loaders. Fragile memorabilia receives additional packaging.",
      category: "Shipping",
      sortOrder: 0,
    },
    {
      question: "What is included in the All-Star Package?",
      answer: "The $50 All-Star Package is a surprise assortment that may include card packs, graded cards, autographs, and event-specific collectibles. Contents vary and no specific items are guaranteed.",
      category: "Packages",
      relatedPageKey: "pricing",
      sortOrder: 0,
    },
    {
      question: "What is guaranteed in the MVP Package?",
      answer: "The $100 MVP Package includes 100+ cards with a guaranteed minimum of one autograph. Additional contents may include figures, graded cards, and event-specific items but vary by promotion.",
      category: "Packages",
      relatedPageKey: "pricing",
      sortOrder: 1,
    },
    {
      question: "How can I contact support?",
      answer: "Email sodascards@gmail.com or call +1 (309) 278-2664 during business hours. You can also use the contact form on our website.",
      category: "General",
      relatedPageKey: "contact",
      sortOrder: 0,
    },
  ];

  for (const faq of faqs) {
    await FAQ.updateOne(
      { question: faq.question },
      { $set: { ...faq, status: "published" } },
      { upsert: true }
    );
  }
  console.log(`✓ FAQs (${faqs.length})`);
}

async function seedTestimonials() {
  const testimonials = [
    {
      customerName: "Demo Collector — Alex R.",
      title: "Demo collector review",
      location: "Illinois",
      text: "This is a demo testimonial for design and development purposes. Replace with a real customer quote before launch.",
      rating: 5,
      avatar: img("collector-badge.svg", "Demo avatar"),
      featured: true,
      sortOrder: 0,
      isDemo: true,
    },
    {
      customerName: "Demo Collector — Jordan M.",
      title: "Demo collector review",
      location: "Midwest",
      text: "Demo testimonial: The shop layout makes it easy to browse cards by condition and price. Not a real customer statement.",
      rating: 5,
      avatar: img("card-back-classic.svg", "Demo avatar"),
      featured: true,
      sortOrder: 1,
      isDemo: true,
    },
    {
      customerName: "Demo Collector — Sam T.",
      title: "Demo collector review",
      location: "USA",
      text: "Demo testimonial about the ticket request process. Must be replaced with verified customer feedback before going live.",
      rating: 4,
      avatar: img("ticket-stub.svg", "Demo avatar"),
      featured: false,
      sortOrder: 2,
      isDemo: true,
    },
    {
      customerName: "Demo Collector — Casey L.",
      title: "Demo collector review",
      location: "Central US",
      text: "Demo review of the MVP package experience. Contents vary as described — this is placeholder copy only.",
      rating: 5,
      avatar: img("mvp-logo.png", "Demo avatar"),
      featured: false,
      sortOrder: 3,
      isDemo: true,
    },
    {
      customerName: "Demo Collector — Riley K.",
      title: "Demo collector review",
      location: "Illinois",
      text: "Demo testimonial about selling a collection. Replace with a real story before launch.",
      rating: 5,
      avatar: img("card-stack.svg", "Demo avatar"),
      featured: true,
      sortOrder: 4,
      isDemo: true,
    },
  ];

  for (const testimonial of testimonials) {
    await Testimonial.updateOne(
      { customerName: testimonial.customerName, isDemo: true },
      { $set: { ...testimonial, status: "published" } },
      { upsert: true }
    );
  }
  console.log(`✓ Testimonials (${testimonials.length})`);
}

async function seedBlogPosts() {
  const posts = [
    {
      title: "[Demo Draft] Getting Started with Card Collecting",
      slug: "demo-getting-started-card-collecting",
      excerpt: "A demo draft post about beginning your card collecting journey. Not published — for development only.",
      coverImage: img("card-back-classic.svg", "Getting started with cards"),
      authorName: "Sodapops Team",
      category: "Collector Education",
      tags: ["demo", "beginner", "cards"],
      body: `<p><strong>Demo draft content.</strong> This article is a placeholder for the Sodapops blog. It covers basic topics like choosing your first cards, understanding condition grades, and building a collection on a budget.</p><p>Replace this content with original, verified educational material before publishing.</p>`,
      inlineImages: [
        img("card-stack.svg", "Card stack"),
        img("grade-label.svg", "Grade label"),
        img("foil-sweep.svg", "Foil detail"),
      ],
      status: "draft",
      isDemo: true,
      plannedPublishDate: new Date("2026-09-01"),
      seo: {
        title: "Getting Started with Card Collecting [Demo]",
        description: "Demo draft — beginner guide to sports card collecting.",
        ogImage: img("card-back-holographic.svg", "Card collecting"),
      },
    },
    {
      title: "[Demo Draft] Understanding Card Conditions and Grading",
      slug: "demo-understanding-card-grading",
      excerpt: "Demo draft explaining raw card conditions and third-party grading basics.",
      coverImage: img("grade-label.svg", "Card grading label"),
      authorName: "Sodapops Team",
      category: "Collector Education",
      tags: ["demo", "grading", "condition"],
      body: `<p><strong>Demo draft content.</strong> Learn about common condition terms — Near Mint, Excellent, Good — and when third-party grading from companies like PSA or BGS adds value.</p><p>This is placeholder copy for CMS development and must be replaced before launch.</p>`,
      inlineImages: [
        img("card-back-holographic.svg", "Graded card"),
        img("vault-panel.svg", "Vault storage"),
        img("collector-badge.svg", "Verification"),
      ],
      status: "draft",
      isDemo: true,
      plannedPublishDate: new Date("2026-09-15"),
      seo: {
        title: "Understanding Card Grading [Demo]",
        description: "Demo draft about card conditions and grading.",
        ogImage: img("grade-label.svg", "Grading"),
      },
    },
    {
      title: "[Demo Draft] Affordable Game Day Experiences for Collectors",
      slug: "demo-affordable-game-day-tips",
      excerpt: "Demo draft about enjoying live games without overspending — placeholder content only.",
      coverImage: img("ticket-stub.svg", "Game day ticket"),
      authorName: "Sodapops Team",
      category: "Live Events",
      tags: ["demo", "tickets", "game-day"],
      body: `<p><strong>Demo draft content.</strong> Tips for finding affordable tickets, planning a game day budget, and combining live events with your collecting hobby.</p><p>Not published. Replace with original content and verify all claims before going live.</p>`,
      inlineImages: [
        img("stadium-lights.svg", "Stadium"),
        img("ticket-texture.svg", "Ticket texture"),
        img("arena-hero-glow.svg", "Arena atmosphere"),
      ],
      status: "draft",
      isDemo: true,
      plannedPublishDate: new Date("2026-10-01"),
      seo: {
        title: "Affordable Game Day Tips [Demo]",
        description: "Demo draft about affordable sporting event tickets.",
        ogImage: img("ticket-stub.svg", "Game day"),
      },
    },
  ];

  for (const post of posts) {
    await BlogPost.updateOne(
      { slug: post.slug },
      { $set: post },
      { upsert: true }
    );
  }
  console.log(`✓ BlogPosts (${posts.length})`);
}

async function seedMediaCategories() {
  const categories = [
    { name: "Hero Images", slug: "hero-images", coverImageUrl: "/assets/site/hero-background.png", sortOrder: 0 },
    { name: "Product Shots", slug: "product-shots", coverImageUrl: "/assets/site/graded-pedestal.jpg", sortOrder: 1 },
    { name: "Card Assets", slug: "card-assets", coverImageUrl: "/assets/site/cards.jpg", sortOrder: 2 },
    { name: "Memorabilia", slug: "memorabilia", coverImageUrl: "/assets/site/memorabilia.jpg", sortOrder: 3 },
    { name: "Tickets & Events", slug: "tickets-events", coverImageUrl: "/assets/site/tickets.jpg", sortOrder: 4 },
    { name: "Backgrounds & Textures", slug: "backgrounds-textures", coverImageUrl: "/assets/site/vault.jpg", sortOrder: 5 },
  ];

  for (const category of categories) {
    await MediaCategory.updateOne(
      { slug: category.slug },
      { $set: { ...category, status: "active" } },
      { upsert: true }
    );
  }
  console.log(`✓ MediaCategories (${categories.length})`);
}

async function main() {
  console.log("Seeding Sodapops Collectibles database...\n");

  await connectDB();

  await seedSiteSettings();
  await seedPages();
  await seedServices();
  await seedOffers();
  await seedProductCategories();
  await seedProducts();
  await seedFaqs();
  await seedTestimonials();
  await seedBlogPosts();
  await seedMediaCategories();

  console.log("\nSeed complete.");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
