"use client"

import { AnimatePresence, motion } from "framer-motion"
import { duration, easeOut } from "@/lib/motion"
import type { ReactNode } from "react"

interface PresenceGridProps {
  children: ReactNode
  className?: string
  loading?: boolean
  loadingContent?: ReactNode
}

export function PresenceGrid({
  children,
  className,
  loading = false,
  loadingContent,
}: PresenceGridProps) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast }}
          className={className}
        >
          {loadingContent}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
