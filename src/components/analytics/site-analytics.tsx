"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";
import Script from "next/script";

import { aiAssistantFrom, ctaFor } from "@/lib/analytics/ai-referrer";
import { trackEvent } from "@/lib/analytics/track";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const AI_SEEN_KEY = "arndvs:ai-referral";

/**
 * Site-wide measurement, mounted once in the root layout:
 * - GA4, only when NEXT_PUBLIC_GA_ID is set, so previews and forks send nothing.
 * - `ai_referral` once per session when a visit comes from an AI assistant.
 * - `cta_click` for links that lead toward a conversation (work with me, email, GitHub, LinkedIn),
 *   by one delegated listener instead of a handler on every button.
 */
export function SiteAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        try {
            if (sessionStorage.getItem(AI_SEEN_KEY)) return;
            const assistant = aiAssistantFrom(document.referrer, window.location.href);
            if (!assistant) return;
            sessionStorage.setItem(AI_SEEN_KEY, assistant);
            trackEvent("ai_referral", { assistant, landing: window.location.pathname });
        } catch {
            /* sessionStorage can be unavailable; skip */
        }
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const a = (e.target as Element | null)?.closest?.("a[href]");
            if (!a) return;
            const cta = ctaFor(a.getAttribute("href") ?? "", window.location.origin);
            if (cta) trackEvent("cta_click", { cta, from: window.location.pathname });
        };
        document.addEventListener("click", onClick, { capture: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, []);

    useEffect(() => {
        if (GA_ID && window.gtag) window.gtag("config", GA_ID, { page_path: pathname });
    }, [pathname]);

    if (!GA_ID) return null;
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)},{send_page_view:false});`}
            </Script>
        </>
    );
}
