"use client"

import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  loading?: boolean
  className?: string
  placeholder?: string
  variant?: "default" | "hero"
}

export function SearchBar({
  value,
  onChange,
  loading = false,
  className,
  placeholder = "Search recipes...",
  variant = "default",
}: SearchBarProps) {
  const isHero = variant === "hero"

  return (
    <div className={cn("relative w-full", className)}>
      {loading ? (
        <Loader2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
      ) : (
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "focus-enhanced h-11 rounded-full border border-border/60 bg-white py-3 pl-11 pr-4 text-sm shadow-none transition-shadow duration-300 focus-visible:ring-1 focus-visible:ring-foreground/15 sm:h-12 sm:text-base",
          isHero
            ? "border-0 bg-white/95 shadow-lg focus-visible:ring-2 focus-visible:ring-white/50"
            : "hover:border-border focus-visible:border-foreground/20"
        )}
        autoComplete="on"
        role="searchbox"
        aria-label="Search recipes"
        aria-busy={loading}
      />
    </div>
  )
}
