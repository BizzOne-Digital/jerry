import { PageHero } from "@/components/sections/PageHero";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        heading="Complete Your Order"
        subheading="Secure checkout with manual invoice follow-up."
        imageUrl={BRAND_IMAGES.display}
      />
      <section className="py-16">
        <CheckoutForm />
      </section>
    </>
  );
}
