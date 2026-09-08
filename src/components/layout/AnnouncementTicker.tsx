"use client";

interface AnnouncementTickerProps {
  text?: string;
}

export function AnnouncementTicker({ text }: AnnouncementTickerProps) {
  if (!text) return null;

  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-3 whitespace-nowrap">
      <span className="h-1.5 w-1.5 rounded-full bg-arena-gold" aria-hidden />
      {text}
    </span>
  ));

  return (
    <div className="w-full max-w-full overflow-hidden border-b border-arena-border bg-arena-navy py-2 text-xs tracking-widest text-arena-gold uppercase">
      <div className="ticker-track flex w-max">{items}{items}</div>
    </div>
  );
}
