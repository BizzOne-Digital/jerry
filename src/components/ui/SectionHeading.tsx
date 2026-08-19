import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-display tracking-[0.2em] text-arena-gold uppercase">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-display text-arena-cream sm:text-4xl">{heading}</h2>
      {subheading && <p className="mt-3 max-w-2xl text-arena-muted">{subheading}</p>}
    </div>
  );
}
