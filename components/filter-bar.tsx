"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function FilterBar({ categories, activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="w-full">
      {/* Mobile: Scrollable horizontal list */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "rounded-full transition-all whitespace-nowrap text-xs px-3 py-1.5 h-auto focus-enhanced flex-shrink-0",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-border/50 hover:border-primary hover:text-primary",
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Flex wrap */}
      <div className="hidden md:flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "rounded-full transition-all focus-enhanced",
              activeCategory === category
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border-border/50 hover:border-primary hover:text-primary",
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
