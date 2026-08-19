import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FaqPreviewProps {
  faqs: Faq[];
}

export function FaqPreview({ faqs }: FaqPreviewProps) {
  const items = (faqs.length ? faqs : FALLBACK).slice(0, 4).map((f) => ({
    id: f._id,
    question: f.question,
    answer: f.answer,
  }));

  return (
    <section className="bg-arena-navy/50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading eyebrow="FAQs" heading="Quick Answers" />
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="mt-10">
          <Accordion items={items} />
        </ScrollReveal>
        <div className="mt-8 text-center">
          <Link href="/faqs">
            <Button variant="ghost">View All FAQs</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

const FALLBACK = [
  { _id: "1", question: "How do you authenticate items?", answer: "Every piece goes through our multi-step verification process with COA cross-referencing." },
  { _id: "2", question: "Do you offer shipping?", answer: "Yes — fully insured shipping with tracking on all orders." },
  { _id: "3", question: "Can I sell my collection?", answer: "Absolutely. Contact us for a free evaluation and fair market offer." },
  { _id: "4", question: "What payment methods do you accept?", answer: "We accept major cards and manual invoice for large purchases." },
];
