"use client";

import { Camera, Clapperboard, Film, Globe, Layers, MonitorPlay, Sparkles } from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Screenplay v7.0": Clapperboard,
    "Prop Bible v4.0": Layers,
    "54-Shot Prompt Library": Camera,
    "Design Memo": Film,
    "Character Consistency": Sparkles,
    "Transmedia Universe": Globe,
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
    fallbackIcon: MonitorPlay,
});
