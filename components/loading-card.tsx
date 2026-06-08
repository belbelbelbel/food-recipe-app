export function LoadingCard() {
  return (
    <div className="w-full">
      <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl bg-surface-muted shimmer sm:mb-6 sm:rounded-3xl" />
      <div className="space-y-2.5 px-0.5">
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-3 w-1/3 rounded shimmer" />
      </div>
    </div>
  )
}
