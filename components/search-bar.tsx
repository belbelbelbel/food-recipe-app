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
          "focus-enhanced h-12 rounded-full py-3 pl-11 pr-4 text-sm transition-shadow duration-300 sm:h-14 sm:text-base",
          isHero
            ? "border-0 bg-white/95 shadow-lg focus-visible:ring-2 focus-visible:ring-white/50"
            : "border-2 border-primary focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-2"
        )}
        autoComplete="on"
        role="searchbox"
        aria-label="Search recipes"
        aria-busy={loading}
      />
    </div>
  )
}
