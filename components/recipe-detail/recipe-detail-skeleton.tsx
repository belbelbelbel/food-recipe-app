import { RECIPE_HERO_FRAME_CLASS, RECIPE_HERO_WRAPPER_CLASS } from "./recipe-hero-layout"

interface RecipeDetailSkeletonProps {
  /** Show placeholder title area inside hero (for direct URL loads) */
  showHeroText?: boolean
}

export function RecipeDetailSkeleton({ showHeroText = true }: RecipeDetailSkeletonProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="relative overflow-hidden bg-neutral-900">
        <div className={RECIPE_HERO_WRAPPER_CLASS}>
          <div className={RECIPE_HERO_FRAME_CLASS}>
            <div className="absolute inset-0 shimmer opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

            {showHeroText && (
              <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
                <div className="mb-3 h-3 w-20 rounded-full bg-white/10" />
                <div className="space-y-2.5">
                  <div className="h-8 w-[min(100%,20rem)] rounded-md bg-white/10 sm:h-10" />
                  <div className="h-8 w-[min(100%,14rem)] rounded-md bg-white/10 sm:h-9" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-8 w-24 rounded-full bg-white/10" />
                  <div className="h-8 w-28 rounded-full bg-white/10" />
                  <div className="h-8 w-32 rounded-full bg-white/10" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container-responsive max-w-7xl">
        <div className="border-b border-border/30 py-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-full rounded-full bg-surface-muted shimmer sm:w-40" />
            <div className="h-11 w-full rounded-full bg-surface-muted shimmer sm:w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 py-12 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20 lg:py-16">
          <div>
            <div className="mb-5 h-8 w-36 rounded-md bg-surface-muted shimmer sm:mb-6" />
            <div className="rounded-2xl border border-border/40 bg-white p-5 sm:p-6">
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-surface-muted shimmer" />
                    <div
                      className="h-4 rounded-full bg-surface-muted shimmer"
                      style={{ width: `${70 - i * 8}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 h-8 w-40 rounded-md bg-surface-muted shimmer sm:mb-8" />
            <div className="space-y-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-primary/20 shimmer" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-full rounded-full bg-surface-muted shimmer" />
                    <div className="h-4 w-4/5 rounded-full bg-surface-muted shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Content skeleton only — sits below a real hero image during transition */
export function RecipeDetailBodySkeleton() {
  return (
    <div className="bg-canvas">
      <div className="container-responsive max-w-7xl">
        <div className="border-b border-border/30 py-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-full rounded-full bg-surface-muted shimmer sm:w-40" />
            <div className="h-11 w-full rounded-full bg-surface-muted shimmer sm:w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 py-12 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20 lg:py-16">
          <div className="rounded-2xl border border-border/40 bg-white p-5 sm:p-6">
            <div className="mb-4 h-6 w-28 rounded-md bg-surface-muted shimmer" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 rounded-full bg-surface-muted shimmer" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 w-32 rounded-md bg-surface-muted shimmer" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-surface-muted shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
