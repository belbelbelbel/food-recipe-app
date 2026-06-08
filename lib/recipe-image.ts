/** Normalize and prefer the sharpest available recipe image URL */
export function recipeImageSrc(url: string | undefined | null): string {
  if (!url || url.trim() === "" || url === "null") {
    return "/placeholder.svg"
  }

  let src = url.trim()

  // TheMealDB: avoid preview-sized paths when present
  if (src.includes("themealdb.com")) {
    src = src
      .replace("/images/preview/", "/images/media/")
      .replace("/preview/", "/")
  }

  return src
}

export function isRemoteRecipeImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}
