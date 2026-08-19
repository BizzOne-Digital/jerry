# Sodapops Collectibles

Premium sports collectibles storefront and CMS for **Sodapops Collectibles LLC** — cards, autographs, memorabilia, affordable game tickets, and collector services.

Built with Next.js App Router, MongoDB, local media uploads, GSAP motion, and a full admin portal.

## Prerequisites

- Node.js 20+
- npm
- MongoDB 7+ (local install or Docker)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start MongoDB (Docker option)
docker compose up -d

# 4. Create admin user
npm run create-admin

# 5. Seed demo content
npm run seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

## MongoDB & Compass

Default connection string:

```
mongodb://127.0.0.1:27017/sodapops_collectibles
```

In MongoDB Compass, paste the URI above to inspect collections (`products`, `services`, `pages`, `orders`, etc.).

Docker alternative:

```bash
docker compose up -d
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | NextAuth secret (32+ chars in production) |
| `ADMIN_EMAIL` | Initial admin email for `create-admin` |
| `ADMIN_PASSWORD` | Initial admin password for `create-admin` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `UPLOAD_DIR` | Local upload directory (default `./uploads`) |
| `STRIPE_SECRET_KEY` | Optional Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Optional Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional Stripe publishable key |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run seed` | Idempotent database seed |
| `npm run create-admin` | Create/update admin user |
| `npm run uploads:cleanup:dry` | Dry-run orphan upload cleanup |
| `npm run uploads:cleanup` | Delete unreferenced upload files |

## Local Uploads

Uploaded images are stored at `./uploads/YYYY/MM/<uuid>.webp` and served via `/media/[...path]`.

- Max size: 10 MB
- Formats: JPEG, PNG, WebP, AVIF (normalized to WebP)
- `/uploads` is gitignored; production requires **persistent disk** on a Node/VPS host

## Optional Stripe

When `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set, checkout can use Stripe Checkout. Without them, orders use **Manual invoice / payment arrangement** with `awaiting_payment` status.

Configure webhook endpoint: `/api/webhooks/stripe` (when Stripe keys are present).

## Public Routes

`/`, `/about`, `/services`, `/services/[slug]`, `/shop`, `/shop/[slug]`, `/pricing`, `/testimonials`, `/faqs`, `/contact`, `/blog`, `/blog/[slug]`, `/cart`, `/checkout`, `/order/success`, `/privacy`, `/terms`

**No public `/gallery` route.** Gallery in admin is a private media library only.

## Admin Modules

Dashboard · Pages · Services · Products · Orders · Pricing/Offers · Gallery · Testimonials · FAQs · Blogs · Messages · Settings

## Pre-Launch Checklist

Replace before going live:

- [ ] Demo testimonials (`isDemo: true`)
- [ ] Draft/demo blog posts (`isDemo: true`)
- [ ] Demo product copy and placeholder imagery
- [ ] `ADMIN_PASSWORD` and `AUTH_SECRET`
- [ ] Company contact details in Settings
- [ ] Authenticity claims only where documented per item
- [ ] Persistent upload storage on production host

## Contact

- Email: sodascards@gmail.com
- Phone: +1 (309) 278-2664
