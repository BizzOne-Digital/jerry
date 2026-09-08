"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { HEADER_NAV, MAIN_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href.split("?")[0]));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-arena-border/60 bg-arena-black/92 backdrop-blur-md"
      )}
    >
      <div className="relative mx-auto flex h-[4.25rem] max-w-[1400px] min-w-0 items-center px-3 sm:h-[5rem] sm:px-6 lg:px-10">
        <Logo variant="wordmark" priority className="relative z-10 shrink-0" />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {HEADER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 font-display text-xs tracking-[0.2em] uppercase transition-colors sm:text-[13px]",
                isActive(item.href) ? "text-arena-gold" : "text-arena-cream/85 hover:text-arena-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="rounded-sm p-2.5 text-arena-cream/80 transition-colors hover:text-arena-gold"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>

          <Link
            href="/cart"
            className="relative rounded-sm p-2.5 text-arena-cream/80 transition-colors hover:text-arena-gold"
            aria-label={`Cart, ${itemCount} items`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-arena-red px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/contact"
            className="hidden rounded-sm border border-arena-gold/70 px-4 py-2 font-display text-xs tracking-[0.18em] text-arena-gold uppercase transition-colors hover:bg-arena-gold/10 sm:inline-flex sm:text-[13px]"
          >
            Contact
          </Link>

          <button
            type="button"
            className="rounded-sm p-2.5 text-arena-cream/80 hover:text-arena-gold lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={handleSearch}
          className={cn(
            "border-t px-4 py-3",
            transparent ? "border-white/10 bg-black/60 backdrop-blur-md" : "border-arena-border bg-arena-navy/95"
          )}
        >
          <input
            type="search"
            placeholder="Search collectibles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-sm border border-arena-border bg-arena-black/80 px-3 py-2 text-sm text-arena-cream placeholder:text-arena-muted focus:border-arena-gold focus:outline-none"
            aria-label="Search"
            autoFocus
          />
        </form>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={MAIN_NAV} />
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M6 6L5 3H2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
