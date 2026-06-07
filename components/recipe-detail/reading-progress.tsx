"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const scaleX = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    scaleX.set(progress)
  }, [progress, scaleX])

  useEffect(() => {
    function handleScroll() {
      const section = document.getElementById("instructions-section")
      if (!section) return

      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionHeight = section.offsetHeight
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const start = sectionTop - windowHeight * 0.5
      const end = sectionTop + sectionHeight - windowHeight * 0.25
      const raw = (scrollY - start) / (end - start)
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-14 z-40 h-px bg-border sm:top-16">
      <motion.div
        className="h-full origin-left bg-primary"
        style={{ scaleX }}
      />
    </div>
  )
}
