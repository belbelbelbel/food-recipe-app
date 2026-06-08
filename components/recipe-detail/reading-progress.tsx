"use client"

import { useEffect, useRef } from "react"

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false

    const update = () => {
      const section = document.getElementById("instructions-section")
      if (!section) {
        bar.style.transform = "scaleX(0)"
        ticking = false
        return
      }

      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionHeight = section.offsetHeight
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const start = sectionTop - windowHeight * 0.5
      const end = sectionTop + sectionHeight - windowHeight * 0.25
      const raw = (scrollY - start) / (end - start)
      const progress = Math.min(1, Math.max(0, raw))

      bar.style.transform = `scaleX(${progress})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-14 z-40 h-0.5 bg-border/60 sm:top-16"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-primary will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
