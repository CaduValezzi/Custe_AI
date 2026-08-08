import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Badge — ported from mock ui/badge, re-tokenized onto brand vars.
 * Variants: default (violet), secondary (surface), outline (bordered).
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none",
        variant === "default" && "border-transparent bg-violet/15 text-violet-light",
        variant === "secondary" && "border-white/10 bg-white/[0.04] text-muted-foreground",
        variant === "outline" && "border-white/10 text-foreground",
        className,
      )}
      {...props}
    />
  )
}
