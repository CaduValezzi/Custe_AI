import * as React from "react"

import { cn } from "@/lib/utils"

/** Separator — ported from mock ui/separator (custom role-based, no Radix). */
function Separator({ className, orientation = "horizontal", ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0 bg-white/[0.07]",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
