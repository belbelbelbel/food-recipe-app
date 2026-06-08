"use client"

import { useState } from "react"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { HERO_IMAGE, HERO_FALLBACK, HERO_TAGLINE, HERO_HEADLINE } from "@/lib/brand"

interface HomeHeroProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchLoading?: boolean
}

export function HomeHero({ searchQuery, onSearchChange, searchLoading }: HomeHeroProps) {
  const [imgError, setImgError] = useState(false)
  const heroSrc = imgError ? HERO_FALLBACK : HERO_IMAGE

  return (
    <section className="relative isolate flex min-h-[min(72vh,640px)] w-full items-center justify-center overflow-hidden bg-neutral-950 sm:min-h-[min(78vh,720px)]">
      <div className="absolute inset-0">
        <Image
          src={heroSrc}
          alt="Featured spread of dishes"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={85}
          onError={() => setImgError(true)}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      <div className="relative z-10 w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-xs">
            Featured
          </p>
          <h1 className="text-balance font-editorial text-3xl font-normal leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {HERO_HEADLINE}
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/70 sm:mt-4 sm:text-base">
            {HERO_TAGLINE}
          </p>

          <div className="mt-8 w-full max-w-md sm:mt-10">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              loading={searchLoading}
              placeholder="Search recipes..."
              variant="hero"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
