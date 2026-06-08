"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Settings, Shield, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useSavedMeals } from "@/contexts/saved-meals-context"
import { handleError, showSuccess } from "@/lib/error-handler"
import { FlavorizLogo } from "@/components/flavoriz-logo"

function useSavedMealsSafe() {
  try {
    return useSavedMeals()
  } catch {
    return { savedCount: 0 }
  }
}

function useAuthSafe() {
  try {
    return useAuth()
  } catch {
    return {
      user: null,
      userProfile: null,
      loading: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    }
  }
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, userProfile, loading, signOut } = useAuthSafe()
  const savedMeals = useSavedMealsSafe()
  const isHome = pathname === "/"

  const links = [
    { href: "/", label: "Home" },
    { href: "/meal-plans", label: "Meal Plans" },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      showSuccess("Signed out successfully", "Goodbye!")
      router.push("/")
    } catch (error) {
      handleError(error, "Failed to sign out")
    }
  }

  const getUserInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-colors duration-300 [transform:translateZ(0)]",
          isHome
            ? "border-primary/10 bg-[#faf8f5]"
            : "border-border/40 bg-background shadow-sm"
        )}
      >
        <div className="container-responsive flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
          <Link
            href="/"
            className="focus-enhanced min-w-0 shrink-0 rounded-xl p-1 transition-opacity hover:opacity-90"
            aria-label="Flavoriz home"
          >
            <FlavorizLogo responsive size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-w-0 items-center gap-4 lg:gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-primary focus-enhanced rounded-md px-2 py-2 lg:px-3",
                  pathname === link.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && savedMeals.savedCount > 0 && (
              <Link
                href="/saved-meals"
                className="relative flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-enhanced rounded-md px-2 py-1"
              >
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={savedMeals.savedCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground"
                  >
                    {savedMeals.savedCount}
                  </motion.span>
                </AnimatePresence>
              </Link>
            )}

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-9 w-9 shrink-0 rounded-full p-0">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {userProfile?.displayName || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          {userProfile?.role && (
                            <div className="mt-1 flex items-center gap-1">
                              {userProfile.role === "admin" && (
                                <Shield className="h-3 w-3 text-primary" />
                              )}
                              <span className="text-xs capitalize text-muted-foreground">
                                {userProfile.role}
                              </span>
                            </div>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/meal-plans" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          My Meal Plans
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/saved-meals" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          Saved Meals
                          {savedMeals.savedCount > 0 && (
                            <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                              {savedMeals.savedCount}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:hidden">
            {user && savedMeals.savedCount > 0 && (
              <Link
                href="/saved-meals"
                className="focus-enhanced relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary"
                aria-label={`Saved meals (${savedMeals.savedCount})`}
              >
                <Heart className="h-5 w-5 text-primary fill-primary" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-semibold text-primary-foreground">
                  {savedMeals.savedCount}
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 shrink-0 p-0 focus-enhanced"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "mobile-menu-content transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-4 flex shrink-0 items-start justify-between gap-3 border-b pb-4">
            <FlavorizLogo size="sm" showTagline className="min-w-0 max-w-[calc(100%-3rem)]" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-10 w-10 shrink-0 p-0 focus-enhanced"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-y-auto overscroll-contain">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-enhanced",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="mt-2 border-t border-border px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {userProfile?.displayName || "User"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/meal-plans"
                      className="flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-enhanced"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5 shrink-0" />
                      My Meal Plans
                    </Link>
                    <Link
                      href="/saved-meals"
                      className="flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-enhanced"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="mr-3 h-5 w-5 shrink-0" />
                      Saved Meals
                      {savedMeals.savedCount > 0 && (
                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {savedMeals.savedCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      className="flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-enhanced"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5 shrink-0" />
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleSignOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex min-h-11 w-full items-center rounded-lg px-4 py-3 text-left text-base font-medium text-destructive transition-colors hover:bg-accent focus-enhanced"
                    >
                      <LogOut className="mr-3 h-5 w-5 shrink-0" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="mt-2 space-y-2 border-t border-border px-4 py-4">
                    <Button variant="outline" className="h-11 w-full" asChild>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button className="h-11 w-full" asChild>
                      <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </nav>

          <div className="mt-4 flex shrink-0 justify-center border-t pt-4">
            <FlavorizLogo size="xs" iconOnly />
          </div>
        </div>
      </div>
    </>
  )
}
