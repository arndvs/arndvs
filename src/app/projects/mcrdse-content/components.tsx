"use client";

import { BookOpen, FileCheck, GitBranch, Search, Shield, Users, Zap } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Content Pipeline": BookOpen,
    "Approval System": FileCheck,
    "AI-Search / GEO": Search,
    "Community Quiz": Users,
    "CRM Sync": GitBranch,
    Security: Shield,
    Automation: Zap,
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
    accentColor: "purple",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons,
    fallbackIcon: Zap,
});
