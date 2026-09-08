import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { resolveServiceImage } from "@/lib/images";

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  cardImage?: { url: string; alt?: string };
}

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section className="bg-arena-navy/50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Services"
            heading="Full-Service Collecting"
            subheading="Buy, sell, trade, authenticate — we've got the playbook."
          />
        </ScrollReveal>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services.length ? services : FALLBACK_SERVICES).map((svc, i) => (
            <ScrollReveal key={svc.slug} delay={i * 0.08} className="h-full">
              <Link
                href="/services"
                className="group flex h-full flex-col overflow-hidden rounded-sm arena-glow bg-arena-surface"
              >
                <div className="relative aspect-[16/10] shrink-0">
                  <Image
                    src={resolveServiceImage(svc.cardImage?.url, svc.slug)}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg text-arena-cream">{svc.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-arena-muted line-clamp-3">{svc.shortDescription}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const FALLBACK_SERVICES: Service[] = [
  { _id: "1", title: "Buying", slug: "buying", shortDescription: "We source grails and everyday hits for your collection." },
  { _id: "2", title: "Selling", slug: "selling", shortDescription: "Turn your collection into cash with fair market pricing." },
  { _id: "3", title: "Authentication", slug: "authentication", shortDescription: "COA verification and condition grading support." },
];
