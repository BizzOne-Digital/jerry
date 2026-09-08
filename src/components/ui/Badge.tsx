import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-arena-gold/30 bg-arena-gold/10 px-2.5 py-0.5 text-[10px] font-display tracking-widest text-arena-gold uppercase",
        className
      )}
      {...props}
    />
  );
}
