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
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={cn(
            "rounded-full transition-all",
            activeCategory === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-border/50 hover:border-primary hover:text-primary",
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
