import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { getPublishedFaqs } from "@/lib/data/faqs";
import { getPageByKey } from "@/lib/data/pages";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  const [page, faqs] = await Promise.all([getPageByKey("faqs"), getPublishedFaqs()]);

  const items = faqs.map((f) => ({ id: f._id, question: f.question, answer: f.answer }));

  return (
    <>
      <PageHero
        eyebrow="Help Center"
        heading={page?.title ?? "Frequently Asked Questions"}
        subheading="Everything you need to know about collecting with us."
        imageUrl={BRAND_IMAGES.grading}
      />
      <section className="py-16">
        <Container className="max-w-3xl">
          <Accordion items={items.length ? items : FALLBACK} />
        </Container>
      </section>
    </>
  );
}

const FALLBACK = [
  { id: "1", question: "How do you authenticate items?", answer: "Every piece goes through our multi-step verification process." },
  { id: "2", question: "Do you ship internationally?", answer: "We primarily ship within the US with full insurance and tracking." },
  { id: "3", question: "What is your return policy?", answer: "Returns are accepted within 14 days for unopened items in original condition." },
  { id: "4", question: "Can I visit in person?", answer: "Yes — contact us to schedule an appointment at our showroom." },
  { id: "5", question: "Do you buy collections?", answer: "We purchase individual items and full collections. Contact us for a quote." },
];
