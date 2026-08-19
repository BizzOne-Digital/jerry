import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        heading="Privacy Policy"
        subheading="How we collect, use, and protect your information."
        imageUrl={BRAND_IMAGES.vault}
      />
      <section className="py-16">
        <Container className="prose prose-invert max-w-3xl">
          <p className="text-arena-muted">
            Sodapops Collectibles LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
            This policy describes how we collect and use personal information when you visit our website,
            make a purchase, or contact us.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Information We Collect</h2>
          <p className="text-arena-muted">
            We collect information you provide directly, such as your name, email address, phone number,
            shipping address, and order details when you make a purchase or submit a contact form.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">How We Use Your Information</h2>
          <ul className="text-arena-muted">
            <li>Process and fulfill orders</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Send order updates and payment instructions</li>
            <li>Improve our website and services</li>
          </ul>
          <h2 className="mt-8 font-display text-arena-cream">Data Security</h2>
          <p className="text-arena-muted">
            We implement reasonable security measures to protect your personal information.
            Payment processing is handled through secure third-party providers when applicable.
          </p>
          <h2 className="mt-8 font-display text-arena-cream">Contact</h2>
          <p className="text-arena-muted">
            For privacy-related questions, contact us at{" "}
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
