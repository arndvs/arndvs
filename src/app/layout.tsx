import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { Toaster } from "sonner"

// ===== Metadata Configuration =====
export const metadata: Metadata = {
  title: {
    default: "Aaron Davis - Full Stack Software Engineer & AI Specialist",
    template: "%s | Aaron Davis",
  },
  description:
    "Self-taught software engineer with 8+ years of experience building AI-powered SaaS platforms. Specializing in React, Next.js, TypeScript, AI integration, RAG systems, and full-stack development. Based in San Diego, CA.",
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "AI Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "AI Integration",
    "RAG Systems",
    "LLM Engineering",
    "San Diego Developer",
    "Self-taught Engineer",
  ],
  authors: [{ name: "Aaron Davis", url: "https://arndvs.com" }],
  creator: "Aaron Davis",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arndvs.com",
    siteName: "Aaron Davis Portfolio",
    title: "Aaron Davis - Full Stack Software Engineer & AI Specialist",
    description:
      "Self-taught software engineer specializing in AI-powered platforms, React, Next.js, and modern full-stack development.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aaron Davis - Full Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaron Davis - Full Stack Software Engineer",
    description:
      "Self-taught software engineer specializing in AI-powered platforms, React, Next.js, and modern full-stack development.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

/**
 * Root layout component that wraps all pages in the application.
 * Provides global navigation, footer, font configuration, toast notifications, and analytics.
 * Implements Geist Sans and Geist Mono fonts for consistent typography.
 * 
 * Features:
 * - Fixed navigation header with routing
 * - Responsive footer with social links and contact form
 * - Toast notifications via Sonner
 * - Analytics tracking via Vercel
 * - Font optimization with Next.js font system
 * - Suspense boundary for progressive hydration
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render within the layout
 * 
 * @example
 * // This layout automatically wraps all pages in the app
 * // No direct usage required - Next.js handles it automatically
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  )
}
