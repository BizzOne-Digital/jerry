import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FOOTER_NAV } from "@/lib/nav";
import { Container } from "@/components/ui/Container";

interface FooterProps {
  companyName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  copyright?: string;
}

export function Footer({
  companyName = "Sodapops Collectibles LLC",
  tagline = "Collect. Trade. Experience the Game.",
  email = "sodascards@gmail.com",
  phone = "+1 (309) 278-2664",
  copyright,
}: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-arena-border bg-arena-navy">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-arena-muted">{tagline}</p>
            <p className="mt-4 text-sm text-arena-muted">
              <a href={`mailto:${email}`} className="hover:text-arena-gold">
                {email}
              </a>
              <br />
              <a href="tel:+13092782664" className="hover:text-arena-gold">
                {phone}
              </a>
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm tracking-wider text-arena-gold">Shop</h3>
            <ul className="space-y-2 text-sm text-arena-muted">
              {FOOTER_NAV.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-arena-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm tracking-wider text-arena-gold">Company</h3>
            <ul className="space-y-2 text-sm text-arena-muted">
              {FOOTER_NAV.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-arena-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm tracking-wider text-arena-gold">Support</h3>
            <ul className="space-y-2 text-sm text-arena-muted">
              {FOOTER_NAV.support.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-arena-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-arena-border pt-6 text-xs text-arena-muted sm:flex-row sm:justify-between">
          <p>{copyright ?? `© ${year} ${companyName}. All rights reserved.`}</p>
          <p className="tracking-widest uppercase">Collector&apos;s Arena</p>
        </div>
      </Container>
    </footer>
  );
}
