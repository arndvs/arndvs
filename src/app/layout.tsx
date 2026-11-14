import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";

import type React from "react";
import { Suspense } from "react";

import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { DM_Sans, Outfit } from "next/font/google";
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

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-satoshi",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["700", "800", "900"],
    variable: "--font-cabinet",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: "Aaron Davis - Applied AI Full-Stack Engineer",
        template: "%s | Aaron Davis",
    },
    description:
        "Applied AI full-stack engineer in San Diego. Founded RipeMetrics and spent 8 years building its marketing automation and AI platform. Braze and Snowflake certified. TypeScript, Python, React, Next.js, RAG, agents. Open to full-time and contract roles.",
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
            "Applied AI full-stack engineer. Founded RipeMetrics and spent 8 years building its marketing automation and AI platform. Braze and Snowflake certified.",
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
            "Applied AI full-stack engineer. Founded RipeMetrics and spent 8 years building its marketing automation and AI platform.",
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
            className={`${dmSans.variable} ${outfit.variable} ${GeistMono.variable}`}
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
