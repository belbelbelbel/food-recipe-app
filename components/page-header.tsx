import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: ReactNode
  description?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
  centered?: boolean
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  className,
  centered = false,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 sm:mb-10 lg:mb-12",
        centered && "text-center",
        action && !centered && "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className={cn("min-w-0", centered && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="font-editorial text-balance text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm text-muted-foreground text-pretty sm:mt-4 sm:text-base md:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "font-editorial mb-5 text-2xl font-normal tracking-tight text-foreground sm:mb-6 sm:text-3xl",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function AuthPageShell({
  children,
  title,
  description,
}: {
  children: ReactNode
  title: ReactNode
  description: string
}) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-canvas px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-editorial text-3xl font-normal tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-white p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
