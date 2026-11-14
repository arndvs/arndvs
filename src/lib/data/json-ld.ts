import { siteConfig } from "@/sanity/env";

export const personJsonLd = {
    "@type": "Person" as const,
    "@id": `${siteConfig.url}/#person`,
    name: "Aaron Davis",
    url: siteConfig.url,
    jobTitle: "Applied AI Full-Stack Engineer",
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
