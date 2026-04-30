import { siteConfig } from "@/sanity/env";

export const personJsonLd = {
    "@type": "Person" as const,
    "@id": `${siteConfig.url}/#person`,
    name: "Aaron Davis",
    url: siteConfig.url,
    jobTitle: "Full-Stack Engineer & Creative Technologist",
    description:
        "Full-stack engineer and creative technologist with 15+ years building for the web — from CMS platforms to AI-powered SaaS products and creative technology projects.",
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
