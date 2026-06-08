export function WeeklyBoardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading meal plan">
      <div className="-mx-4 flex gap-3 overflow-hidden px-4 sm:mx-0 sm:px-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-[9.5rem] shrink-0 rounded-2xl border border-border/60 bg-white p-3 sm:w-40"
          >
            <div className="mb-3 h-4 w-14 rounded shimmer" />
            <div className="space-y-2">
              <div className="h-[4.5rem] rounded-xl shimmer" />
              <div className="h-[4.5rem] rounded-xl shimmer" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 pt-6">
        <div className="mb-3 h-4 w-36 rounded shimmer" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex h-[4.5rem] items-center gap-3 rounded-xl border border-border/40 p-2">
              <div className="h-12 w-12 shrink-0 rounded-lg shimmer" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-4/5 rounded shimmer" />
                <div className="h-2.5 w-1/2 rounded shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
