import { BrandImage } from "@/components/ui/BrandImage";
import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  imageUrl: string;
}

export function PageHero({ eyebrow, heading, subheading, imageUrl }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <BrandImage src={imageUrl} alt="" fill className="object-cover opacity-35" sizes="100vw" priority />
      <div className="absolute inset-0 arena-gradient opacity-90" />
      <Container className="relative">
        {eyebrow && (
          <p className="mb-3 text-xs font-display tracking-[0.25em] text-arena-gold uppercase">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl text-arena-cream sm:text-4xl lg:text-5xl">{heading}</h1>
        {subheading && <p className="mt-4 max-w-2xl text-base text-arena-muted sm:text-lg">{subheading}</p>}
      </Container>
    </section>
  );
}
