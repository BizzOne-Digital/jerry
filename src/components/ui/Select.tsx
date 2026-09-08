import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ className, label, error, id, options, ...props }: SelectProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-arena-muted">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-sm border border-arena-border bg-arena-navy px-4 py-2.5 text-arena-cream focus:border-arena-gold focus:outline-none focus:ring-1 focus:ring-arena-gold/40",
          error && "border-arena-coral",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-arena-coral">{error}</p>}
    </div>
  );
}
