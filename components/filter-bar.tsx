"use client"

import { cn } from "@/lib/utils"

interface FilterBarProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function FilterBar({ categories, activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="relative w-full">
      {/* Fade edges on scroll */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#faf8f5] to-transparent sm:w-12" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#faf8f5] to-transparent sm:w-12" />

      <div className="scrollbar-hide -mx-4 overflow-x-auto overscroll-x-contain px-4 sm:-mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-x-6 sm:gap-x-10 md:gap-x-12">
          {categories.map((category) => {
            const isActive = activeCategory === category
            const label = category === "All" ? "All Recipes" : category

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "focus-enhanced relative flex min-h-11 flex-shrink-0 items-center whitespace-nowrap pb-3 pt-1 text-left transition-colors duration-300 sm:min-h-0 sm:pb-4",
                  isActive ? "text-foreground" : "text-muted-foreground/55 hover:text-muted-foreground"
                )}
              >
                <span className="font-editorial text-lg font-normal tracking-tight sm:text-2xl md:text-3xl">
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-foreground" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
