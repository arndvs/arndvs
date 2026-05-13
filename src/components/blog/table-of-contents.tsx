"use client";

import { List } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type { ExtractedHeading } from "@/lib/utils/extract-headings";

interface TableOfContentsProps {
    headings: ExtractedHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const isClickScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!headings.length) return;

        const handleScroll = () => {
            if (isClickScrollingRef.current) return;

            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings.at(i);

                if (!heading) continue;

                const el = document.getElementById(heading.id);

                if (el) {
                    const rect = el.getBoundingClientRect();

                    if (rect.top <= 150) {
                        setActiveId(heading.id);
                        break;
                    }
                }
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [headings]);

    const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        isClickScrollingRef.current = true;
        setActiveId(id);

        const targetEl = document.getElementById(id);

        if (!targetEl) return;

        const headerEl = document.querySelector("header");
        const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
        const rect = targetEl.getBoundingClientRect();
        const y = window.scrollY + rect.top - headerHeight - 32;

        window.scrollTo({ top: y, behavior: "smooth" });

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = setTimeout(() => {
            isClickScrollingRef.current = false;
            window.history.replaceState(null, "", `#${id}`);
        }, 800);
    };

    return (
        <nav aria-label="Table of contents" className="h-full">
            {/* Mobile: collapsible */}
            <details className="mb-8 rounded-lg border p-4 lg:hidden">
                <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <List className="h-4 w-4" />
                    Table of Contents
                </summary>
                <ul className="mt-3 space-y-1.5">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={handleClick(heading.id)}
                                className={`block text-sm transition-colors ${
                                    heading.level === 3 ? "pl-4" : ""
                                } ${
                                    activeId === heading.id
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {heading.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </details>

            {/* Desktop: sticky sidebar */}
            <div className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <List className="h-4 w-4" />
                    Table of Contents
                </p>
                <ul className="space-y-1.5 border-l">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={handleClick(heading.id)}
                                className={`-ml-px block border-l-2 py-1 text-sm transition-colors ${
                                    heading.level === 3 ? "pl-6" : "pl-4"
                                } ${
                                    activeId === heading.id
                                        ? "border-primary text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 border-transparent"
                                }`}
                            >
                                {heading.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
