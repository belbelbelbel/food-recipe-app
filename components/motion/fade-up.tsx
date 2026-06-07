"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { duration, easeOut, stagger } from "@/lib/motion"

interface FadeUpProps extends HTMLMotionProps<"div"> {
  index?: number
  delay?: number
}

export function FadeUp({ index = 0, delay, children, ...props }: FadeUpProps) {
  const computedDelay = delay ?? stagger(index)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: duration.normal, ease: easeOut, delay: computedDelay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
