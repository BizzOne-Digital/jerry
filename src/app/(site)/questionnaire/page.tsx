import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { CollectorQuestionnaireForm } from "@/components/sections/CollectorQuestionnaireForm";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = {
  title: "Collector Profile",
  description:
    "Tell Sodapops Collectibles about your favorite sports, teams, players, and collecting goals so we can personalize recommendations.",
};

export default function QuestionnairePage() {
  return (
    <>
      <PageHero
        eyebrow="Collector Profile"
        heading="Help Us Know Your Collection"
        subheading="A quick profile so we can match you with better cards, autographs, memorabilia, and ticket opportunities."
        imageUrl={BRAND_IMAGES.collection}
      />
      <section className="py-16">
        <Container className="max-w-2xl">
          <div className="mb-8 space-y-4 text-sm leading-relaxed text-arena-muted">
            <p>
              At Sodapops Collectibles, every collector is different. This short questionnaire helps us
              understand what you love — your favorite sports, teams, players, and the items you are
              building toward — so we can curate smarter recommendations and fill packages with pieces
              you will actually want to keep.
            </p>
            <p>
              It only takes a few minutes. If you just placed an order, include your order number and we
              will use your answers to personalize that experience too.
            </p>
          </div>
          <CollectorQuestionnaireForm />
        </Container>
      </section>
    </>
  );
}
