export interface SiteFaq {
  id: string;
  question: string;
  answer: string;
}

export const SITE_FAQS: SiteFaq[] = [
  {
    id: "faq-1",
    question: "How do I place an order?",
    answer:
      "Browse our shop, add items to your cart, and complete checkout. We accept manual invoice payment by default, with optional Stripe checkout when configured.",
  },
  {
    id: "faq-2",
    question: "What payment methods do you accept?",
    answer:
      "Our default payment option is manual invoice / payment arrangement. Stripe Checkout is available when configured with valid environment credentials.",
  },
  {
    id: "faq-3",
    question: "How do I sell my collection?",
    answer:
      "Use the contact form with inquiry type Sell. Include photos and descriptions of your items for the fastest evaluation.",
  },
  {
    id: "faq-4",
    question: "How does trading work?",
    answer:
      "Submit a trade proposal via the contact form. We'll assess value on both sides and propose balanced terms for your approval.",
  },
  {
    id: "faq-5",
    question: "Are all autographs authenticated?",
    answer:
      "No. Authentication status is listed on each individual item. Items with documentation include COA references. We never imply authentication when it is not documented.",
  },
  {
    id: "faq-6",
    question: "How do I request game tickets?",
    answer:
      "Submit a contact inquiry with type Tickets. Include the event, preferred date, and budget range. We'll respond with available options.",
  },
  {
    id: "faq-7",
    question: "What are your shipping policies?",
    answer:
      "All shipped orders include tracking. Cards are sent in protective sleeves and top loaders. Fragile memorabilia receives additional packaging.",
  },
  {
    id: "faq-8",
    question: "What is included in the All-Star Package?",
    answer:
      "The $50 All-Star Package is a surprise assortment that may include card packs, graded cards, autographs, and event-specific collectibles. Contents vary and no specific items are guaranteed.",
  },
  {
    id: "faq-9",
    question: "What is guaranteed in the MVP Package?",
    answer:
      "The $100 MVP Package includes 100+ cards with a guaranteed minimum of one autograph. Additional contents may include figures, graded cards, and event-specific items but vary by promotion.",
  },
  {
    id: "faq-10",
    question: "How can I contact support?",
    answer:
      "Email sodascards@gmail.com or call +1 (309) 278-2664 during business hours. You can also use the contact form on our website.",
  },
];
