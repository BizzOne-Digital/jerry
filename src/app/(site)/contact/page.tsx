import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { DEFAULT_SITE_SETTINGS } from "@/lib/data/defaults";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const { contact } = DEFAULT_SITE_SETTINGS;

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        heading="Contact Us"
        subheading="Questions about buying, selling, or trading? We're here to help."
        imageUrl={BRAND_IMAGES.contact}
      />
      <section className="py-16">
        <Container>
          <div className="grid min-w-0 gap-12 lg:grid-cols-2">
            <div className="min-w-0">
              <ContactForm />
            </div>
            <div className="min-w-0 space-y-6">
              <div className="arena-glow rounded-sm bg-arena-surface p-6">
                <h2 className="font-display text-lg text-arena-gold">Contact Info</h2>
                <p className="mt-4 text-sm text-arena-muted">
                  <a href={`mailto:${contact.email}`} className="hover:text-arena-cream">
                    {contact.email}
                  </a>
                </p>
                <p className="mt-2 text-sm text-arena-muted">
                  <a href={contact.phoneLink} className="hover:text-arena-cream">
                    {contact.phone}
                  </a>
                </p>
                {contact.businessHours && (
                  <p className="mt-4 text-sm text-arena-muted">{contact.businessHours}</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
