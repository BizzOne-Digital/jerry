import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        heading="Terms of Service"
        subheading="Please read these terms before using our services."
        imageUrl={BRAND_IMAGES.arena}
      />
      <section className="py-16">
        <Container className="prose prose-invert max-w-3xl">
          <p className="text-arena-muted">
            By accessing or using the Sodapops Collectibles website and services, you agree to these
            Terms of Service. If you do not agree, please do not use our services.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Products & Authenticity</h2>
          <p className="text-arena-muted">
            All items are described to the best of our ability. Authenticated items include
            documentation where applicable. Condition reports are provided for graded and raw items.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Orders & Payment</h2>
          <p className="text-arena-muted">
            Orders are confirmed upon receipt of payment or approved manual invoice. Prices are in USD
            unless otherwise stated. We reserve the right to cancel orders for pricing errors or
            inventory issues.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Shipping & Returns</h2>
          <p className="text-arena-muted">
            Shipping times and costs vary by item and destination. Returns are accepted within 14 days
            for eligible unopened items. Contact us for return authorization.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Limitation of Liability</h2>
          <p className="text-arena-muted">
            Sodapops Collectibles LLC is not liable for indirect, incidental, or consequential damages
            arising from use of our services or products.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Contact</h2>
          <p className="text-arena-muted">
            Questions about these terms? Email{" "}
            <a href="mailto:sodascards@gmail.com" className="text-arena-gold">
              sodascards@gmail.com
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
