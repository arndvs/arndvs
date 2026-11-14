"use client";

import { Database, FileText, GitBranch, MessageSquare, Server, Table2, Zap } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Data Contract": Table2,
    Journey: GitBranch,
    Message: MessageSquare,
    Warehouse: Database,
    Backend: Server,
    "Design Record": FileText,
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
    accentColor: "teal",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons,
    fallbackIcon: Zap,
});
