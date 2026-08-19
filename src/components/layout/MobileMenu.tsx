"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  readonly label: string;
  readonly href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
}

export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/75"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav className="absolute right-0 top-0 flex h-full w-72 flex-col bg-arena-navy p-6 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo variant="wordmark" />
          <button
            type="button"
            className="text-arena-muted hover:text-arena-gold"
            aria-label="Close menu"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "block rounded-sm px-3 py-3 font-display text-sm tracking-wider uppercase",
                  pathname === item.href ? "text-arena-gold" : "text-arena-cream hover:bg-arena-surface"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          onClick={onClose}
          className="mt-6 inline-flex justify-center rounded-sm border border-arena-gold/70 px-4 py-3 font-display text-xs tracking-[0.2em] text-arena-gold uppercase"
        >
          Contact
        </Link>
      </nav>
    </div>
  );
}
