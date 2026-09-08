export const DEFAULT_SITE_SETTINGS = {
  general: {
    companyName: "Sodapops Collectibles LLC",
    tagline: "Collect. Trade. Experience the Game.",
    defaultSeoTitle: "Sodapops Collectibles",
    defaultSeoDescription: "Premium sports cards, authenticated memorabilia, and game-day experiences.",
    announcementText: "",
  },
  contact: {
    email: "sodascards@gmail.com",
    phone: "+1 (309) 278-2664",
    phoneLink: "tel:+13092782664",
    businessHours: "Mon–Sat, 10am–6pm CT",
  },
  footer: {
    copyright: "© Sodapops Collectibles LLC. All rights reserved.",
  },
  motion: {
    enableIntro: false,
    introOncePerSession: true,
  },
} as const;
