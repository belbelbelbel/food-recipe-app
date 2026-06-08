/** Image quality passed to next/image — higher on detail views */
export const RECIPE_IMAGE_QUALITY = {
  card: 90,
  hero: 95,
} as const

/** Normalize API image URLs to the sharpest available source */
export function recipeImageSrc(url: string | undefined | null): string {
  if (!url || url.trim() === "" || url === "null") {
    return "/placeholder.svg"
  }

  let src = url.trim()

  if (src.includes("themealdb.com")) {
    // TheMealDB: full-size images live under /images/media/
    src = src
      .replace("http://", "https://")
      .replace("/images/preview/", "/images/media/")
      .replace("/images/thumb/", "/images/media/")
      .replace("/preview/", "/")
      .replace(/-small(\.(jpg|jpeg|png|webp))$/i, "$1")
      .replace(/-medium(\.(jpg|jpeg|png|webp))$/i, "$1")
      .replace(/-thumb(\.(jpg|jpeg|png|webp))$/i, "$1")
  }

  return src
}

export function isRemoteRecipeImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}

/** Detail hero: serve original remote file for max clarity (already cached from grid click) */
export function shouldUseUnoptimizedImage(src: string, context: "card" | "hero" = "card"): boolean {
  return context === "hero" && isRemoteRecipeImage(src)
}
