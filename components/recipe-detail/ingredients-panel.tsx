interface IngredientsPanelProps {
  ingredients: string[]
}

export function IngredientsPanel({ ingredients }: IngredientsPanelProps) {
  return (
    <section className="lg:sticky lg:top-24 lg:self-start">
      <h2 className="font-editorial mb-5 text-2xl font-normal tracking-tight sm:text-3xl">
        Ingredients
      </h2>
      <div className="rounded-2xl border border-border/40 bg-white p-5 sm:p-6">
        <ul className="divide-y divide-border/40">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-foreground">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-foreground sm:text-base">
                {ingredient}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
