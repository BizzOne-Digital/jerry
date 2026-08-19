export interface SiteTestimonial {
  _id: string;
  customerName: string;
  title?: string;
  location?: string;
  text: string;
  rating?: number;
}

export const SITE_TESTIMONIALS: SiteTestimonial[] = [
  {
    _id: "t1",
    customerName: "Mike R.",
    title: "Card Collector",
    location: "Chicago, IL",
    text: "Sold my rookie card collection here and got a fair offer within 48 hours. Clear condition notes and no surprises at checkout.",
    rating: 5,
  },
  {
    _id: "t2",
    customerName: "Sarah L.",
    title: "Season Ticket Holder",
    location: "St. Louis, MO",
    text: "Requested playoff tickets through their VIP service and the seats were exactly as described. Smooth communication from start to finish.",
    rating: 5,
  },
  {
    _id: "t3",
    customerName: "James T.",
    title: "Memorabilia Investor",
    location: "Indianapolis, IN",
    text: "Honest grading assessments and fair market pricing. This is my go-to shop when I am buying authenticated pieces for my display.",
    rating: 5,
  },
  {
    _id: "t4",
    customerName: "Elena V.",
    title: "Autograph Collector",
    location: "Milwaukee, WI",
    text: "Every signed item I have purchased came with proper documentation. The team knows their stuff and answers questions quickly.",
    rating: 5,
  },
  {
    _id: "t5",
    customerName: "Chris P.",
    title: "Youth League Coach",
    location: "Peoria, IL",
    text: "Picked up an MVP card package for our team fundraiser raffle. Great variety and the kids loved opening every pack.",
    rating: 4,
  },
  {
    _id: "t6",
    customerName: "Dana K.",
    title: "Vintage Ticket Collector",
    location: "Springfield, IL",
    text: "Found a rare postseason stub I had been hunting for years. Listing photos matched the item and shipping was secure and fast.",
    rating: 5,
  },
];
