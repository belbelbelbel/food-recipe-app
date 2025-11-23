"use client"

import { toast } from "@/hooks/use-toast"

export class AppError extends Error {
  constructor(
    message: string,
    public title: string = "Error",
    public showToast: boolean = true
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown, defaultMessage: string = "Something went wrong") {
  console.error("Error:", error)

  if (error instanceof AppError && error.showToast) {
    toast({
      title: error.title,
      description: error.message,
      variant: "destructive",
    })
    return
  }

  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message || defaultMessage,
      variant: "destructive",
    })
    return
  }

  toast({
    title: "Error",
    description: defaultMessage,
    variant: "destructive",
  })
}

export function showSuccess(message: string, title: string = "Success") {
  toast({
    title,
    description: message,
  })
}

