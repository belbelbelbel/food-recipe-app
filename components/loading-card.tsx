export function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  )
}
