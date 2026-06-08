import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { AuthProvider } from "@/contexts/auth-context"
import { MotionProvider } from "@/components/motion/motion-provider"
import { SavedMealsProvider } from "@/contexts/saved-meals-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Flavoriz - Discover Amazing Recipes",
  description: "Explore culinary insights and discover delicious recipes from around the world. Perfect for food lovers and cooking enthusiasts.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
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
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Flavoriz — Recipes worth craving",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flavoriz - Discover Amazing Recipes",
    description: "Explore culinary insights and discover delicious recipes from around the world",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <AuthProvider>
          <MotionProvider>
          <SavedMealsProvider>
          <div className="flex min-h-screen flex-col">
            <ErrorBoundaryWrapper>
              <Suspense fallback={null}>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
              </Suspense>
            </ErrorBoundaryWrapper>
          </div>
          <Toaster />
          <Analytics />
          </SavedMealsProvider>
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
