import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Flavoriz - Discover Amazing Recipes",
  description: "Explore culinary insights and discover delicious recipes from around the world. Perfect for food lovers and cooking enthusiasts.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  keywords: "recipes, cooking, food, culinary, meal plans, ingredients, kitchen",
  authors: [{ name: "Flavoriz Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://food-recipe-app-nine-inky.vercel.app/",
    title: "Flavoriz - Discover Amazing Recipes",
    description: "Explore culinary insights and discover delicious recipes from around the world",
    siteName: "Flavoriz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flavoriz - Discover Amazing Recipes",
    description: "Explore culinary insights and discover delicious recipes from around the world",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <ErrorBoundaryWrapper>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </Suspense>
            </ErrorBoundaryWrapper>
          </div>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
