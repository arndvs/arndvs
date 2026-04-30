"use client";

import { Activity, Brain, Database, GitBranch, Mail, Search, Shield } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Content & CMS": Database,
    "Security Pipeline": Shield,
    "SEO Engine": Search,
    "AI Services": Brain,
    "Email System": Mail,
    Observability: Activity,
    "CI/CD Pipeline": GitBranch,
};

export const {
    BackButton,
    HeroSection,
    SituationSection,
    ArchitectureSection,
    DeepDiveSection,
    DecisionLog,
    LearningsGrid,
    MetricsSection,
    GallerySection,
    CTASection,
} = createCaseStudySections({
    accentColor: "cyan",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons,
    fallbackIcon: Activity,
});
