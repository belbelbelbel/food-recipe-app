export function LoadingCard() {
  return (
    <div className="w-full">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl shimmer" />
      <div className="space-y-2 px-1">
        <div className="h-5 w-3/4 rounded shimmer" />
        <div className="h-4 w-1/2 rounded shimmer" />
      </div>
    </div>
  )
}
