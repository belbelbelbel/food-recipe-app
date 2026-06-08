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
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-canvas to-transparent sm:w-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-canvas to-transparent sm:w-10" />

      <div className="scrollbar-hide overflow-x-auto overscroll-x-contain">
        <div className="mx-auto flex w-max min-w-full items-center justify-center gap-x-8 px-2 sm:gap-x-12 md:gap-x-16">
          {categories.map((category) => {
            const isActive = activeCategory === category
            const label = category === "All" ? "All Recipes" : category

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "focus-enhanced relative flex min-h-11 flex-shrink-0 items-center whitespace-nowrap pb-4 pt-1 transition-colors duration-300 sm:min-h-0 sm:pb-5",
                  isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                )}
              >
                <span className="font-editorial text-xl font-normal tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-foreground" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
