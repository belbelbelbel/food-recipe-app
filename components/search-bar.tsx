"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md sm:max-w-lg">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search recipes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-full border-border/50 focus-visible:ring-primary text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base focus-enhanced"
        autoComplete="off"
        role="searchbox"
        aria-label="Search recipes"
      />
    </div>
  )
}
