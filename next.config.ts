import type { NextConfig } from "next";

type Header = { key: string; value: string };

function buildSecurityHeaders({
    permissionsPolicy = "camera=(), microphone=(), geolocation=()",
}: {
    permissionsPolicy?: string;
} = {}): Header[] {
    return [
        { key: "X-Content-Type-Options", value: "nosniff" },
        // SAMEORIGIN, not DENY: the Studio's Presentation tool renders previewed
        // pages in a same-origin iframe, and DENY blocks that outright. This still
        // refuses any third-party framing, which is the clickjacking case.
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "Permissions-Policy", value: permissionsPolicy },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];
}

const nextConfig: NextConfig = {
    logging: {
        browserToTerminal: "error",
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/transcribe",
                headers: buildSecurityHeaders({
                    permissionsPolicy: "camera=(), microphone=(self), geolocation=()",
                }),
            },
            {
                source: "/((?!transcribe).*)",
                headers: buildSecurityHeaders(),
            },
            {
                source: "/(.+\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|woff|woff2|ttf|eot|css|js))$",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    // TODO: Add Content-Security-Policy once all script/style sources are audited
};

export default nextConfig;
