import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { CartSummary } from "@/components/shop/CartSummary";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Your Cart"
        heading="Review Your Picks"
        subheading="Authenticated collectibles ready for checkout."
        imageUrl={BRAND_IMAGES.cards}
      />
      <section className="py-16">
        <Container className="max-w-2xl">
          <CartSummary />
        </Container>
      </section>
    </>
  );
}
