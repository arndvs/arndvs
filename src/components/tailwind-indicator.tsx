"use client";

import { useEffect, useState } from "react";

export function TailwindIndicator({ position }: { position?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        import("tailwind-indicator").then(() => setMounted(true));
    }, []);

    if (!mounted) return null;

    // @ts-expect-error — custom element registered by tailwind-indicator
    return <tailwind-indicator suppressHydrationWarning position={position} />;
}
