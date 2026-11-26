"use client";

import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

/**
 * One call for every analytics event: Vercel Web Analytics always, and GA4 when
 * NEXT_PUBLIC_GA_ID is set (see GoogleAnalytics). Never throws: analytics must not break a page.
 */
export function trackEvent(name: string, props: Props = {}): void {
    try {
        vercelTrack(name, props);
    } catch {
        /* ignore */
    }
    try {
        window.gtag?.("event", name, props);
    } catch {
        /* ignore */
    }
}
