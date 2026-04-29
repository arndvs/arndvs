"use client";

import { Code2, Database, Globe, LayoutDashboard, Lock, Palette, Server } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Next.js 16 + React 19": Code2,
    "Sanity v5 CMS": Database,
    "Convex Backend": Server,
    "Clerk Authentication": Lock,
    "temporal.ts Engine": LayoutDashboard,
    "Design System": Palette,
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
    fallbackIcon: Globe,
});
