import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";

interface Offer {
  _id: string;
  name: string;
  slug: string;
  price: number;
  summary?: string;
  images?: { url: string; alt?: string }[];
}

interface OffersSectionProps {
  offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  const items = offers.length ? offers : FALLBACK_OFFERS;
  return (
    <section className="py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Packages"
            heading="Game Day Offers"
            subheading="Curated ticket and memorabilia packages for the ultimate fan experience."
          />
        </ScrollReveal>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((offer, i) => (
            <ScrollReveal key={offer.slug} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-sm arena-glow bg-arena-surface">
                <div className="relative aspect-video shrink-0">
                  <Image
                    src={offer.images?.[0]?.url ?? BRAND_IMAGES.package}
                    alt={offer.name}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg text-arena-cream">{offer.name}</h3>
                  <p className="mt-1 text-arena-gold">{formatCurrency(offer.price)}</p>
                  {offer.summary && (
                    <p className="mt-2 flex-1 text-sm text-arena-muted line-clamp-3">{offer.summary}</p>
                  )}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/shop?category=Packages">
            <Button>View All Packages</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

const FALLBACK_OFFERS: Offer[] = [
  { _id: "1", name: "VIP Game Day", slug: "vip-game-day", price: 499, summary: "Premium seats + signed memorabilia." },
  { _id: "2", name: "Rookie Starter", slug: "rookie-starter", price: 149, summary: "Curated rookie card bundle." },
  { _id: "3", name: "Championship Vault", slug: "championship-vault", price: 999, summary: "Limited edition championship relic set." },
];
