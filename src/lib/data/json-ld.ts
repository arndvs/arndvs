import { siteConfig } from "@/sanity/env";

function credential(name: string, issuer: string, issuerUrl: string, dateCreated: string) {
    return {
        "@type": "EducationalOccupationalCredential" as const,
        name,
        credentialCategory: "certification",
        dateCreated,
        recognizedBy: { "@type": "Organization" as const, name: issuer, url: issuerUrl },
    };
}

export const personJsonLd = {
    "@type": "Person" as const,
    "@id": `${siteConfig.url}/#person`,
    name: "Aaron Davis",
    url: siteConfig.url,
    alternateName: "arndvs",
    jobTitle: "Applied AI Full-Stack Engineer",
    image: `${siteConfig.url}/images/aaron-davis.webp`,
    email: "mailto:aaron@arndvs.com",
    // Location is what separates this Aaron Davis from the others in search results.
    homeLocation: {
        "@type": "Place" as const,
        name: "San Diego, California",
        address: {
            "@type": "PostalAddress" as const,
            addressLocality: "San Diego",
            addressRegion: "CA",
            addressCountry: "US",
        },
    },
    workLocation: {
        "@type": "Place" as const,
        name: "San Diego, California, or remote",
    },
    // Credentials from docs/reference/facts-ledger.md (Confirmed there; dates follow LinkedIn).
    hasCredential: [
        credential("Braze Certified Practitioner", "Braze", "https://www.braze.com", "2026-10"),
        credential(
            "Braze Certified Marketing Specialist",
            "Braze",
            "https://www.braze.com",
            "2026-10",
        ),
        credential(
            "Snowflake Data Engineering Professional Certificate",
            "Snowflake",
            "https://www.snowflake.com",
            "2026-10",
        ),
        credential(
            "Snowflake Generative AI Professional Certificate",
            "Snowflake",
            "https://www.snowflake.com",
            "2026-10",
        ),
    ],
    description:
        "Applied AI full-stack engineer with 15+ years building for the web. Co-founded RipeMetrics, a marketing automation, CRM, and AI customer service platform, and built on it for 8 years. Builds AI systems, agent infrastructure, and lifecycle marketing systems.",
    sameAs: ["https://github.com/arndvs", "https://linkedin.com/in/arndvs"],
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
        "Marketing Automation",
        "Lifecycle Marketing",
        "Braze",
        "Snowflake",
    ],
    alumniOf: [
        {
            "@type": "EducationalOrganization" as const,
            name: "UC San Diego Extended Studies",
        },
        {
            "@type": "EducationalOrganization" as const,
            name: "Stanford University Online",
        },
        {
            "@type": "EducationalOrganization" as const,
            name: "California State University, East Bay",
        },
    ],
};

/** RipeMetrics, which Aaron co-founded. Linked from the Person so the founder fact is structured. */
export const ripemetricsJsonLd = {
    "@type": "Organization" as const,
    "@id": `${siteConfig.url}/projects/ripemetrics/#organization`,
    name: "RipeMetrics",
    description: "Marketing automation, CRM and AI customer service platform.",
    founder: { "@id": `${siteConfig.url}/#person` },
};
