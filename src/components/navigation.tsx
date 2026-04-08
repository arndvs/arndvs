"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlitchName } from "./glitch-name"
import { ContactForm } from "./contact-form"
const navItems = [
  { name: "Home", href: "/", ariaLabel: "Go to home page" },
  { name: "About", href: "/about", ariaLabel: "Learn more about Aaron" },
  { name: "Projects", href: "/projects", ariaLabel: "View project portfolio" },
]
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
          <div className="flex items-center gap-8" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  item.href !== "/" && pathname.startsWith(item.href) && "text-foreground",
                )}
                aria-label={item.ariaLabel}
                aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
            <ContactForm triggerText="Contact" triggerVariant="default" triggerSize="sm" showIcon={false} />
          </div>
        </div>
      </div>
    </nav>
  )
}
