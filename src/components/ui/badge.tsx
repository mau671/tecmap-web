import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-gray-950 dark:text-gray-50",
        completed: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        "in-progress": "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        pending: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
