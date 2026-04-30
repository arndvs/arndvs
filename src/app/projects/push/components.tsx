"use client";

import {
    Camera,
    CheckCircle2,
    Circle,
    Clapperboard,
    Film,
    Globe,
    Layers,
    MonitorPlay,
    Sparkles,
} from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Screenplay v7.0": Clapperboard,
    "Prop Bible v4.0": Layers,
    "55-Shot Prompt Library": Camera,
    "Design Memo": Film,
    "Character Consistency": Sparkles,
    "Transmedia Universe": Globe,
};

type PhaseStatus = "complete" | "active" | "upcoming";

const phases: { label: string; status: PhaseStatus }[] = [
    { label: "Writing & Research", status: "active" },
    { label: "Pre-production", status: "active" },
    { label: "AI Image Generation", status: "upcoming" },
    { label: "AI Video Generation", status: "upcoming" },
    { label: "Post-production", status: "upcoming" },
];

export function ProductionProgress() {
    return (
        <div className="border-border bg-card mt-12 rounded-lg border p-6">
            <p className="text-muted-foreground mb-4 text-sm font-medium tracking-wider uppercase">
                Production Status
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
                {phases.map((phase, i) => (
                    <div key={phase.label} className="flex items-center gap-2 sm:flex-1">
                        <div className="flex items-center gap-2 sm:flex-col sm:gap-1 sm:text-center">
                            {phase.status === "complete" ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                            ) : phase.status === "active" ? (
                                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                    <span className="absolute h-5 w-5 animate-ping rounded-full bg-orange-500/30" />
                                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                                </div>
                            ) : (
                                <Circle className="text-muted-foreground/40 h-5 w-5 shrink-0" />
                            )}
                            <span
                                className={`text-sm ${
                                    phase.status === "active"
                                        ? "text-foreground font-semibold"
                                        : phase.status === "complete"
                                          ? "text-muted-foreground"
                                          : "text-muted-foreground/60"
                                }`}
                            >
                                {phase.label}
                            </span>
                        </div>
                        {i < phases.length - 1 && (
                            <div className="bg-border hidden h-px flex-1 sm:mx-3 sm:block" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

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
