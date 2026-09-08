import Image from "next/image";
import { isPackageLogoImage } from "@/lib/image-utils";
import type { ImageRef, PageSection } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface ImageGalleryProps {
  images: ImageRef[];
  columns?: 2 | 3 | 4 | 5;
}

export function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 md:grid-cols-4"
        : columns === 5
          ? "grid-cols-2 md:grid-cols-5"
          : "grid-cols-2 md:grid-cols-3";

  return (
    <div className={`grid gap-3 ${gridClass}`}>
      {images.map((img, i) => {
        const isLogo = isPackageLogoImage(img.url);
        return (
        <ScrollReveal key={img.url + i} delay={i * 0.05}>
          <div className="relative aspect-square overflow-hidden rounded-sm arena-glow">
            <Image
              src={img.url}
              alt={img.alt ?? `Gallery image ${i + 1}`}
              fill
              className={isLogo ? "object-contain bg-arena-navy p-3" : "object-cover"}
              sizes="25vw"
            />
          </div>
        </ScrollReveal>
      );
      })}
    </div>
  );
}

interface SectionRendererProps {
  sections: PageSection[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  const enabled = sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <>
      {enabled.map((section) => (
        <section key={section.id} className="py-16">
          <Container>
            <ScrollReveal>
              {(section.eyebrow || section.heading) && (
                <SectionHeading
                  eyebrow={section.eyebrow}
                  heading={section.heading ?? ""}
                  subheading={section.subheading ?? section.body}
                />
              )}
              {section.items && (
                <ul className="mt-6 space-y-2 text-arena-muted">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              )}
              {section.stats && (
                <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                  {section.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-display text-3xl text-arena-gold">{s.value}</p>
                      <p className="text-sm text-arena-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.images && section.images.length > 0 && (
                <div className="mt-10">
                  <ImageGallery images={section.images} />
                </div>
              )}
              {section.image && !section.images && (
                <div className="relative mt-10 aspect-video overflow-hidden rounded-sm arena-glow">
                  <Image
                    src={section.image.url}
                    alt={section.image.alt ?? ""}
                    fill
                    className={
                      isPackageLogoImage(section.image.url)
                        ? "object-contain bg-arena-navy p-6"
                        : "object-cover"
                    }
                    sizes="80vw"
                  />
                </div>
              )}
            </ScrollReveal>
          </Container>
        </section>
      ))}
    </>
  );
}
