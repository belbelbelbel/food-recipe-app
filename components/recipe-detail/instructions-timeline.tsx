interface InstructionsTimelineProps {
  instructions: string[]
}

export function InstructionsTimeline({ instructions }: InstructionsTimelineProps) {
  return (
    <section id="instructions-section">
      <h2 className="font-editorial mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
        Instructions
      </h2>
      <ol className="relative space-y-0">
        {instructions.map((instruction, index) => (
          <li key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {index < instructions.length - 1 && (
              <span
                className="absolute left-4 top-9 bottom-0 w-px -translate-x-1/2 bg-border"
                aria-hidden
              />
            )}
            <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground sm:h-9 sm:w-9">
              {index + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-pretty text-foreground sm:text-base sm:leading-7">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
