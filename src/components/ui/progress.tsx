"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-gray-100 border border-gray-100 relative h-3 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full transition-all duration-300 ease-in-out bg-black"
        style={{
          width: `${value ?? 0}%`,
          minWidth: value && value > 0 ? "4px" : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
