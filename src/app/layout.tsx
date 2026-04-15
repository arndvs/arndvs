import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";

import type React from "react";
import { Suspense } from "react";

import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import { DisableDraftMode } from "@/components/disable-draft-mode";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: "Aaron Davis - Full-Stack Engineer & AI Systems Consultant",
        template: "%s | Aaron Davis",
    },
    description:
        "Full-stack engineer and AI systems consultant based in San Diego. Founded RipeMetrics (50+ enterprise clients), built a 44k-line healthcare platform with 5 AI integrations. AI agent architecture, React, Next.js, TypeScript, OpenAI, RAG systems.",
    keywords: [
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
        title: "Aaron Davis - Full Stack Software Engineer & AI Specialist",
        description:
            "Full-stack engineer and AI builder. Founded RipeMetrics (50+ enterprise clients), built healthcare platforms with AI integrations. React, Next.js, TypeScript.",
        images: [
            {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Aaron Davis - Full Stack Software Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Aaron Davis - Full Stack Software Engineer",
        description:
            "Full-stack engineer and AI builder. Founded RipeMetrics (50+ enterprise clients), built healthcare platforms with AI integrations.",
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
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "32x32" },
        ],
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
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
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: safeJsonLdStringify({
                                "@context": "https://schema.org",
                                "@graph": [
                                    {
                                        "@type": "Person",
                                        "@id": `${siteConfig.url}/#person`,
                                        name: "Aaron Davis",
                                        url: siteConfig.url,
                                        jobTitle: "Full-Stack Engineer & AI Systems Consultant",
                                        description:
                                            "Full-stack engineer and AI systems consultant with 8+ years of experience building AI-powered SaaS platforms, agentic systems, and specialist agent architectures.",
                                        sameAs: [
                                            "https://github.com/arndvs",
                                            "https://linkedin.com/in/arndvs",
                                        ],
                                        knowsAbout: [
                                            "React",
                                            "Next.js",
                                            "TypeScript",
                                            "Node.js",
                                            "Python",
                                            "AI Engineering",
                                            "RAG Systems",
                                            "OpenAI",
                                            "Sanity CMS",
                                            "Model Context Protocol",
                                            "Agentic Engineering",
                                            "Full-Stack Development",
                                        ],
                                        alumniOf: [
                                            {
                                                "@type": "EducationalOrganization",
                                                name: "UC San Diego Extended Studies",
                                            },
                                            {
                                                "@type": "EducationalOrganization",
                                                name: "Stanford University Online",
                                            },
                                            {
                                                "@type": "EducationalOrganization",
                                                name: "California State University, East Bay",
                                            },
                                        ],
                                    },
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
            </body>
        </html>
    );
}
