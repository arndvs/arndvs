"use client";

import { Github, Linkedin, Menu } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { ContactForm } from "./contact-form";
import { GlitchName } from "./glitch-name";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navItems = [
    { name: "Home", href: "/", ariaLabel: "Go to home page" },
    { name: "About", href: "/about", ariaLabel: "Learn more about Aaron" },
    { name: "Projects", href: "/projects", ariaLabel: "View project portfolio" },
    { name: "Blog", href: "/blog", ariaLabel: "Read blog posts" },
    { name: "Work With Me", href: "/work-with-me", ariaLabel: "Work with Aaron" },
];

const socialLinks = [
    {
        href: "https://github.com/arndvs",
        icon: Github,
        label: "GitHub",
    },
    {
        href: "https://linkedin.com/in/arndvs",
        icon: Linkedin,
        label: "LinkedIn",
    },
];

export function Navigation() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let rafId: number;
        const handleScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 20);
            });
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => setOpen(false));
    }, [pathname]);

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <nav
            className={cn(
                "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-border/40 bg-background/80 border-b backdrop-blur-md"
                    : "bg-transparent",
            )}
            aria-label="Main navigation"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <GlitchName />

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                                aria-label={item.ariaLabel}
                                aria-current={isActive(item.href) ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-1 md:flex">
                        {socialLinks.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                size="icon"
                                asChild
                                className="text-muted-foreground hover:text-foreground h-9 w-9"
                            >
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                >
                                    <link.icon className="h-4 w-4" />
                                </a>
                            </Button>
                        ))}
                        <ThemeToggle />
                        <ContactForm triggerVariant="ghost" triggerSize="sm" />
                    </div>

                    {/* Mobile nav */}
                    <div className="flex items-center gap-1 md:hidden">
                        <ThemeToggle />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Open menu"
                                    className="h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetHeader>
                                    <SheetTitle className="text-left">Menu</SheetTitle>
                                </SheetHeader>
                                <div className="mt-8 flex flex-col gap-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                                                isActive(item.href)
                                                    ? "text-primary bg-primary/10"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                            )}
                                            aria-label={item.ariaLabel}
                                            aria-current={isActive(item.href) ? "page" : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="border-border mt-4 flex items-center gap-2 border-t pt-4">
                                        {socialLinks.map((link) => (
                                            <Button
                                                key={link.href}
                                                variant="outline"
                                                size="icon"
                                                asChild
                                                className="h-10 w-10"
                                            >
                                                <a
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={link.label}
                                                >
                                                    <link.icon className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        ))}
                                        <ContactForm triggerVariant="outline" triggerSize="icon" />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
