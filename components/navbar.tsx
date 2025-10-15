"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/meal-plans", label: "Meal Plans" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-7xl mx-auto justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            FLAV<span className="text-primary">ORIZ</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
