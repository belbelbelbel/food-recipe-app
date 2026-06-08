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
    <section className="relative isolate w-full min-h-[calc(100svh-3.5rem)] overflow-hidden bg-neutral-950 sm:min-h-[calc(100svh-4rem)]">
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75 sm:text-xs">
              Featured
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {HERO_HEADLINE}
            </h1>
            <p className="mt-3 text-sm text-white/65 sm:text-base">{HERO_TAGLINE}</p>
          </div>

          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both delay-150 lg:max-w-sm">
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
