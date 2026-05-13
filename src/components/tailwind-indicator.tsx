"use client";

import { useEffect, useState } from "react";

export function TailwindIndicator({ position }: { position?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let cancelled = false;
        import("tailwind-indicator")
            .then(() => {
                if (!cancelled) setMounted(true);
            })
            .catch((error) => {
                if (process.env.NODE_ENV === "development") {
                    console.error("[TailwindIndicator] Failed to load:", error);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!mounted) return null;

    // @ts-expect-error — custom element registered by tailwind-indicator
    return <tailwind-indicator suppressHydrationWarning position={position} />;
}
