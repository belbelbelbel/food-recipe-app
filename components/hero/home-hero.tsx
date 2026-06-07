"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { SearchBar } from "@/components/search-bar"
import { HERO_IMAGE, HERO_FALLBACK, HERO_TAGLINE, HERO_HEADLINE } from "@/lib/brand"
import { duration, easeOut } from "@/lib/motion"

interface HomeHeroProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchLoading?: boolean
}

export function HomeHero({ searchQuery, onSearchChange, searchLoading }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [imgError, setImgError] = useState(false)
  const heroSrc = imgError ? HERO_FALLBACK : HERO_IMAGE

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, 32])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-neutral-950"
      style={{ minHeight: "calc(100svh - 3.5rem)" }}
    >
      {/* Full-bleed cinematic hero */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <Image
          src={heroSrc}
          alt="Featured spread of dishes"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
          onError={() => setImgError(true)}
        />
      </motion.div>

      {/* Cinematic overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      {/* Bottom-left editorial copy */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easeOut, delay: 0.15 }}
            className="max-w-xl"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75 sm:text-xs">
              Featured
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {HERO_HEADLINE}
            </h1>
            <p className="mt-3 text-sm text-white/65 sm:text-base">{HERO_TAGLINE}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut, delay: 0.3 }}
            className="w-full max-w-md lg:max-w-sm"
          >
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              loading={searchLoading}
              placeholder="Search recipes..."
              variant="hero"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
