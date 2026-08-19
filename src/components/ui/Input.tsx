import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-arena-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-sm border border-arena-border bg-arena-navy px-4 py-2.5 text-arena-cream placeholder:text-arena-muted/60 focus:border-arena-gold focus:outline-none focus:ring-1 focus:ring-arena-gold/40",
          error && "border-arena-coral",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-arena-coral">{error}</p>}
    </div>
  );
}
