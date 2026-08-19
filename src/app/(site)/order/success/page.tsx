import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Order Confirmed" };

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Success"
        heading="Order Received!"
        subheading="We'll send payment instructions shortly."
        imageUrl={BRAND_IMAGES.spotlight}
      />
      <section className="py-16">
        <Container className="max-w-xl text-center">
          {order && (
            <p className="font-display text-2xl text-arena-gold">Order #{order}</p>
          )}
          <p className="mt-4 text-arena-muted">
            Thank you for your order. Our team will review your request and send a manual invoice
            with payment instructions within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
