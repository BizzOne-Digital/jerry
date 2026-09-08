import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { CollectorQuestionnaireForm } from "@/components/sections/CollectorQuestionnaireForm";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = {
  title: "Collector Profile",
  description: "Tell us about your favorite sports, teams, and collecting interests.",
};

export default function QuestionnairePage() {
  return (
    <>
      <PageHero
        eyebrow="Collector Profile"
        heading="Help Us Know Your Collection"
        subheading="Share your favorite sports, teams, players, and what you collect so we can curate the best finds for you."
        imageUrl={BRAND_IMAGES.collection}
      />
      <section className="py-16">
        <Container className="max-w-2xl">
          <CollectorQuestionnaireForm />
        </Container>
      </section>
    </>
  );
}
