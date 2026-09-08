import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";

export function VaultSection() {
  const images = [
    BRAND_IMAGES.vault,
    BRAND_IMAGES.grading,
    BRAND_IMAGES.display,
    BRAND_IMAGES.vintage,
    BRAND_IMAGES.collection,
  ];

  return (
    <section className="relative overflow-hidden py-24">
      <Image src={BRAND_IMAGES.vault} alt="" fill className="object-cover opacity-20" sizes="100vw" />
      <Container className="relative">
        <ScrollReveal>
          <SectionHeading
            eyebrow="The Vault"
            heading="Secured. Authenticated. Arena-Ready."
            subheading="Every piece passes our authentication pipeline before it hits the floor."
            align="center"
            className="mx-auto"
          />
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
          {images.map((src, i) => (
            <ScrollReveal key={src} delay={i * 0.06}>
              <div className="relative aspect-square overflow-hidden rounded-sm arena-glow">
                <Image src={src} alt={`Vault showcase ${i + 1}`} fill className="object-cover" sizes="20vw" />
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/about">
            <Button variant="secondary">Learn Our Process</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
