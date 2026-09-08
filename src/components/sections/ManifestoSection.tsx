import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";

interface ManifestoSectionProps {
  heading?: string;
  body?: string;
  imageUrl?: string;
}

export function ManifestoSection({
  heading = "Built for Collectors Who Play to Win",
  body = "At Sodapops Collectibles, every card, autograph, and ticket tells a story. We curate authenticated pieces with arena-level presentation and white-glove service.",
  imageUrl = BRAND_IMAGES.arena,
}: ManifestoSectionProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <SectionHeading heading={heading} subheading={body} />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm arena-glow">
              <Image src={imageUrl} alt="Collector's arena manifesto" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
