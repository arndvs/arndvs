import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import type React from "react";
import { Suspense } from "react";

import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import localFont from "next/font/local";
import { draftMode } from "next/headers";

import { DisableDraftMode } from "@/components/disable-draft-mode";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { personJsonLd } from "@/lib/data/json-ld";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

// Self-hosted so the build does not depend on fetching Google Fonts.
// Type system shared with the LinkedIn banner: Bebas Neue headings,
// IBM Plex Sans body, IBM Plex Mono labels and code.
const plexSans = localFont({
    src: [
        { path: "../assets/fonts/ibm-plex-sans-400.woff2", weight: "400", style: "normal" },
        { path: "../assets/fonts/ibm-plex-sans-500.woff2", weight: "500", style: "normal" },
        { path: "../assets/fonts/ibm-plex-sans-700.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-body",
    display: "swap",
});

const bebasNeue = localFont({
    src: [{ path: "../assets/fonts/bebas-neue-400.woff2", weight: "400", style: "normal" }],
    variable: "--font-heading",
    display: "swap",
});

const plexMono = localFont({
    src: [
        { path: "../assets/fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
        { path: "../assets/fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
        { path: "../assets/fonts/ibm-plex-mono-600.woff2", weight: "600", style: "normal" },
    ],
    variable: "--font-code",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: "Aaron Davis - Applied AI Full-Stack Engineer",
        template: "%s | Aaron Davis",
    },
    description:
        "Applied AI full-stack engineer in San Diego. Co-founded RipeMetrics and spent 8 years building its marketing automation and AI platform. Braze and Snowflake certified. TypeScript, Python, React, Next.js, RAG, agents. Open to full-time and contract roles.",
    keywords: [
        "Applied AI Engineer",
        "Forward Deployed Engineer",
        "Marketing Automation Engineer",
        "Lifecycle Marketing",
        "Braze",
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
    ],
    authors: [{ name: "Aaron Davis", url: siteConfig.url }],
    creator: "Aaron Davis",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        siteName: "Aaron Davis Portfolio",
        title: "Aaron Davis - Applied AI Full-Stack Engineer",
        description:
            "Applied AI full-stack engineer. Co-founded RipeMetrics and spent 8 years building its marketing automation and AI platform. Braze and Snowflake certified.",
        images: [
            {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Aaron Davis - Applied AI Full-Stack Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Aaron Davis - Applied AI Full-Stack Engineer",
        description:
            "Applied AI full-stack engineer. Co-founded RipeMetrics and spent 8 years building its marketing automation and AI platform.",
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
    manifest: "/site.webmanifest",
};
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isEnabled: isDraftMode } = await draftMode();
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${plexSans.variable} ${bebasNeue.variable} ${plexMono.variable}`}
        >
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: safeJsonLdStringify({
                                "@context": "https://schema.org",
                                "@graph": [
                                    personJsonLd,
                                    {
                                        "@type": "WebSite",
                                        "@id": `${siteConfig.url}/#website`,
                                        url: siteConfig.url,
                                        name: "Aaron Davis Portfolio",
                                        author: { "@id": `${siteConfig.url}/#person` },
                                    },
                                ],
                            }),
                        }}
                    />
                    <Suspense
                        fallback={
                            <div className="flex min-h-screen items-center justify-center">
                                Loading...
                            </div>
                        }
                    >
                        <Navigation />
                        {children}
                        <Footer />
                    </Suspense>
                    <Toaster position="top-right" richColors closeButton />
                    <SanityLive />
                    {isDraftMode && (
                        <>
                            <VisualEditing />
                            <DisableDraftMode />
                        </>
                    )}
                </ThemeProvider>
                <Analytics />
                {process.env.NODE_ENV === "development" && <TailwindIndicator />}
            </body>
        </html>
    );
}
