export function LoadingCard() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden bg-muted/60" />
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2 sm:space-y-3">
          {/* Title skeleton */}
          <div className="h-4 sm:h-5 md:h-6 bg-muted/60 rounded w-3/4" />
          {/* Subtitle skeleton */}
          <div className="h-3 sm:h-4 bg-muted/60 rounded w-1/2" />
        </div>
        
        {/* Duration skeleton */}
        <div className="flex items-center gap-1.5 mt-auto">
          <div className="h-3 w-3 sm:h-4 sm:w-4 bg-muted/60 rounded" />
          <div className="h-3 sm:h-4 bg-muted/60 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
