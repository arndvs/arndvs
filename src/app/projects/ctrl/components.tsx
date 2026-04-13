"use client";

import { Bot, Brain, Radar, Shield, Terminal, Workflow } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "The Pipeline": Workflow,
    "Context Detection": Radar,
    "Hardened Secrets": Shield,
    "Skill System": Brain,
    "shift Loop": Bot,
    Bootstrap: Terminal,
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
    accentColor: "orange",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons,
    fallbackIcon: Terminal,
});
