import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { SITE_FAQS } from "@/lib/data/site-faqs";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "FAQs" };

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Help Center"
        heading="Frequently Asked Questions"
        subheading="Everything you need to know about collecting with us."
        imageUrl={BRAND_IMAGES.faq}
      />
      <section className="py-16">
        <Container className="max-w-3xl">
          <Accordion items={SITE_FAQS} />
        </Container>
      </section>
    </>
  );
}
