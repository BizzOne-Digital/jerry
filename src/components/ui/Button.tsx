import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "coral" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-arena-gold text-arena-black hover:bg-arena-gold-bright focus-visible:ring-arena-gold",
  secondary:
    "bg-arena-surface text-arena-cream border border-arena-border hover:border-arena-gold/50",
  ghost: "bg-transparent text-arena-cream hover:bg-arena-surface/80",
  coral: "bg-arena-coral text-white hover:brightness-110",
  outline:
    "bg-transparent border border-arena-gold/40 text-arena-gold hover:bg-arena-gold/10",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-display font-medium tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
