/** Apple-like deceleration curve */
export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSnappy = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
}

export const springSmooth = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
}

export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
}

export function stagger(index: number, cap = 0.4): number {
  return Math.min(index * 0.05, cap)
}

export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useMotionSafe() {
  const prefersReduced = reducedMotion()
  return {
    prefersReduced,
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: duration.normal, ease: easeOut },
    hoverY: prefersReduced ? 0 : -4,
    spring: prefersReduced ? { duration: 0 } : springSnappy,
  }
}
