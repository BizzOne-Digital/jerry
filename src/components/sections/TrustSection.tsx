import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const TRUST_STATS = [
  { label: "Items Authenticated", value: "10K+" },
  { label: "Happy Collectors", value: "2,500+" },
  { label: "Years in the Game", value: "15+" },
  { label: "5-Star Reviews", value: "98%" },
];

export function TrustSection() {
  return (
    <section className="border-y border-arena-border bg-arena-black py-16">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Trust"
            heading="Arena-Grade Reputation"
            align="center"
            className="mx-auto mb-12"
          />
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {TRUST_STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl text-arena-gold">{stat.value}</p>
              <p className="mt-2 text-sm text-arena-muted">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
