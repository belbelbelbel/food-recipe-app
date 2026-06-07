"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { reducedMotion } from "@/lib/motion"

interface SaveCelebrationProps {
  show: boolean
  onComplete?: () => void
}

export function SaveCelebration({ show, onComplete }: SaveCelebrationProps) {
  const [visible, setVisible] = useState(false)
  const prefersReduced = reducedMotion()

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 320)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.85, 1.12, 1], opacity: 1 }}
            transition={{
              duration: prefersReduced ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Heart className="h-4 w-4 fill-primary text-primary drop-shadow-sm" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
