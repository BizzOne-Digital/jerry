import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-32">
      <Container className="text-center">
        <p className="font-display text-6xl text-arena-gold">404</p>
        <h1 className="mt-4 font-display text-2xl text-arena-cream">Page Not Found</h1>
        <p className="mt-2 text-arena-muted">This collectible seems to have left the arena.</p>
        <Link href="/" className="mt-8 inline-block">
          <Button>Back to Home</Button>
        </Link>
      </Container>
    </section>
  );
}
