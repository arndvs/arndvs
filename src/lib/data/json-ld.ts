import { siteConfig } from "@/sanity/env";

export const personJsonLd = {
    "@type": "Person" as const,
    "@id": `${siteConfig.url}/#person`,
    name: "Aaron Davis",
    url: siteConfig.url,
    jobTitle: "Full-Stack Engineer & AI Systems Consultant",
    description:
        "Full-stack engineer and AI systems consultant with 8+ years of experience building AI-powered SaaS platforms, agentic systems, and specialist agent architectures.",
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
