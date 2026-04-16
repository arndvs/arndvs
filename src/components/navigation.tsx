"use client";

import { Menu } from "lucide-react";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { GlitchName } from "./glitch-name";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navItems = [
    { name: "Home", href: "/", ariaLabel: "Go to home page" },
    { name: "About", href: "/about", ariaLabel: "Learn more about Aaron" },
    { name: "Projects", href: "/projects", ariaLabel: "View project portfolio" },
    { name: "Blog", href: "/blog", ariaLabel: "Read blog posts" },
];
export function Navigation() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <nav
            className="border-border/40 bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm"
            aria-label="Main navigation"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center" aria-label="Aaron Davis - Home">
                        <GlitchName />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "hover:text-primary text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "text-foreground"
                                        : "text-muted-foreground",
                                )}
                                aria-label={item.ariaLabel}
                                aria-current={isActive(item.href) ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Button asChild variant="default" size="sm">
                            <Link href="/work-with-me">Work with me</Link>
                        </Button>
                        <ThemeToggle />
                    </div>

                    {/* Mobile nav */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "hover:text-primary text-lg font-medium transition-colors",
                                            isActive(item.href)
                                                ? "text-foreground"
                                                : "text-muted-foreground",
                                        )}
                                        aria-label={item.ariaLabel}
                                        aria-current={isActive(item.href) ? "page" : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Button asChild variant="default">
                                    <Link href="/work-with-me">Work with me</Link>
                                </Button>
                                <ThemeToggle />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
