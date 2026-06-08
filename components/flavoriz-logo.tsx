"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

interface FlavorizLogoProps {
  className?: string
  size?: "xs" | "sm" | "md" | "lg"
  showTagline?: boolean
  variant?: "default" | "light"
  /** Icon-only below sm, full wordmark from sm up */
  responsive?: boolean
  /** Always show icon mark only */
  iconOnly?: boolean
}

const sizes = {
  xs: { icon: 24, word: "text-base", tag: "text-[8px]" },
  sm: { icon: 28, word: "text-base sm:text-lg", tag: "text-[9px] sm:text-[10px]" },
  md: { icon: 30, word: "text-lg sm:text-xl md:text-2xl", tag: "text-[10px]" },
  lg: { icon: 44, word: "text-2xl sm:text-3xl", tag: "text-xs" },
}

function LogoMark({
  size,
  gradientId,
}: {
  size: number
  gradientId: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1208" />
          <stop offset="55%" stopColor="#5c3a1e" />
          <stop offset="100%" stopColor="#ff6b00" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      <path
        d="M12 24c0-6 4.5-10 8-10s8 4 8 10"
        fill="#ff6b00"
        fillOpacity="0.45"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      <ellipse cx="20" cy="25" rx="9" ry="2.5" fill="#000" fillOpacity="0.2" />
      <path
        d="M16 14c2-5 2-8 0-12M20 13c1.5-4 1.5-6.5 0-10M24 15c2-4.5 2-7.5 0-11"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle
        cx="28"
        cy="12"
        r="3.5"
        fill="#faf8f5"
        fillOpacity="0.15"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
    </svg>
  )
}

function Wordmark({
  wordClass,
  tagClass,
  showTagline,
  variant,
}: {
  wordClass: string
  tagClass: string
  showTagline: boolean
  variant: "default" | "light"
}) {
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span
        className={cn(
          "truncate font-editorial font-medium tracking-tight",
          wordClass,
          variant === "light" ? "text-white" : "text-foreground"
        )}
      >
        flavor
        <span className="bg-gradient-to-r from-[#c45a00] to-primary bg-clip-text text-transparent">
          iz
        </span>
      </span>
      {showTagline && (
        <span
          className={cn(
            "mt-1 truncate font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em]",
            tagClass,
            variant === "light" ? "text-white/70" : "text-muted-foreground"
          )}
        >
          Discover · Cook · Savor
        </span>
      )}
    </span>
  )
}

export function FlavorizLogo({
  className,
  size = "md",
  showTagline = false,
  variant = "default",
  responsive = false,
  iconOnly = false,
}: FlavorizLogoProps) {
  const gradientId = useId().replace(/:/g, "")
  const s = sizes[size]

  if (responsive) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <span className="sm:hidden">
          <LogoMark size={sizes.xs.icon} gradientId={`${gradientId}-mobile`} />
        </span>
        <span className="hidden items-center gap-2 sm:inline-flex md:gap-2.5">
          <LogoMark size={s.icon} gradientId={`${gradientId}-desktop`} />
          <Wordmark
            wordClass={s.word}
            tagClass={s.tag}
            showTagline={false}
            variant={variant}
          />
        </span>
      </span>
    )
  }

  if (iconOnly) {
    return (
      <span className={cn("inline-flex", className)}>
        <LogoMark size={s.icon} gradientId={gradientId} />
      </span>
    )
  }

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      <LogoMark size={s.icon} gradientId={gradientId} />
      <Wordmark
        wordClass={s.word}
        tagClass={s.tag}
        showTagline={showTagline}
        variant={variant}
      />
    </span>
  )
}
