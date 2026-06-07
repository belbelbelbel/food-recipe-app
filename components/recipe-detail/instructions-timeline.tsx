"use client"

import { motion } from "framer-motion"
import { duration, easeOut } from "@/lib/motion"

interface InstructionsTimelineProps {
  instructions: string[]
}

export function InstructionsTimeline({ instructions }: InstructionsTimelineProps) {
  return (
    <section id="instructions-section">
      <h2 className="mb-5 text-xl font-semibold sm:text-2xl">Instructions</h2>
      <ol className="space-y-5 sm:space-y-6">
        {instructions.map((instruction, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="flex gap-4"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground sm:h-9 sm:w-9">
              {index + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-pretty sm:text-base">{instruction}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
