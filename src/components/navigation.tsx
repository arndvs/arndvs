"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlitchName } from "./glitch-name"

// ===== Navigation Data =====
const navItems = [
  { name: "Home", href: "/", ariaLabel: "Go to home page" },
  { name: "About", href: "/about", ariaLabel: "Learn more about Aaron" },
  { name: "Projects", href: "/projects", ariaLabel: "View project portfolio" },
]

/**
 * Main navigation component with fixed positioning and backdrop blur.
 * Features active state highlighting, responsive design, and interactive glitch name effect.
 * 
 * Includes:
 * - GlitchName component with hover animations and encoding transformations
 * - Active route highlighting based on current pathname
 * - Smooth color transitions on hover
 * - Fixed positioning with semi-transparent backdrop
 * - Responsive layout with consistent spacing
 * 
 * @example
 * <Navigation />
 */
export function Navigation() {
  const pathname = usePathname()

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center"
            aria-label="Aaron Davis - Home"
          >
            <GlitchName />
          </Link>
          <div className="flex gap-8" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
                aria-label={item.ariaLabel}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
