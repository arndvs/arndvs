"use client";

import {
    Database,
    FileText,
    Mic,
    MonitorSmartphone,
    ShieldCheck,
    Workflow,
    Zap,
} from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    Capture: Mic,
    Jobs: Workflow,
    Drafting: FileText,
    "Side Panel": MonitorSmartphone,
    "Safe Insert": ShieldCheck,
    "Her Data": Database,
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
    accentColor: "green",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons,
    fallbackIcon: Zap,
});
