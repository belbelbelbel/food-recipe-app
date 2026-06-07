"use client"

import { motion } from "framer-motion"
import { duration, easeOut } from "@/lib/motion"

interface IngredientsPanelProps {
  ingredients: string[]
}

export function IngredientsPanel({ ingredients }: IngredientsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: duration.normal, ease: easeOut }}
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Ingredients</h2>
      <div className="rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6">
        <ul className="space-y-2.5 sm:space-y-3">
          {ingredients.map((ingredient, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: duration.fast, delay: Math.min(index * 0.02, 0.2) }}
              className="flex items-start gap-3"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed sm:text-base">{ingredient}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}
