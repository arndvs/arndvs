"use client";

import { Activity, Bot, Brain, Radar, Shield, ShieldCheck, Terminal, Workflow } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "The Pipeline": Workflow,
    "Compliance HUD": Activity,
    "Lifecycle Hooks": ShieldCheck,
    "Dual CLI": Terminal,
    "Context Detection": Radar,
    "Hardened Secrets": Shield,
    "Skill System": Brain,
    "shft Loop": Bot,
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
