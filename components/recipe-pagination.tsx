"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { duration, easeOut } from "@/lib/motion"

interface RecipePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function RecipePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: RecipePaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      role="navigation"
      aria-label="Recipe pagination"
      className={cn("mt-12 flex flex-col items-center gap-4 sm:mt-16", className)}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border/60 bg-white shadow-none"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="relative flex items-center gap-1 rounded-full bg-surface-muted/80 p-1 sm:gap-1.5">
          {pages.map((pageNum) => {
            const isActive = pageNum === page
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative z-10 flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-200 sm:h-10 sm:min-w-10",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="recipe-pagination-active"
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{pageNum}</span>
              </button>
            )
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border/60 bg-white shadow-none"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <motion.p
        key={page}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, ease: easeOut }}
        className="text-xs text-muted-foreground sm:text-sm"
      >
        Page {page} of {totalPages}
      </motion.p>
    </nav>
  )
}

export const RECIPES_PER_PAGE = 6
