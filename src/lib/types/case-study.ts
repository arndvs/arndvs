export interface HeroData {
    badge: string;
    title: string;
    tagline: string;
    stats: { label: string; value: string }[];
    cta: { text: string; href: string };
    screenshotSrc?: string;
    screenshotAlt?: string;
}

export interface SituationData {
    narrative: string[];
    context: {
        role: string;
        timeline: string;
        client: string;
        live: string;
        stack: string[];
    };
}

export interface SubsystemCard {
    title: string;
    description: string;
}

export interface ArchitectureData<TDiagramKey extends string = string> {
    intro: string;
    diagramKey: TDiagramKey;
    secondaryDiagramKey?: TDiagramKey;
    secondaryDiagramTitle?: string;
    subsystems: SubsystemCard[];
}

export interface DeepDive<TDiagramKey extends string = string> {
    id: string;
    title: string;
    subtitle: string;
    problem: string;
    diagramKey: TDiagramKey;
    walkthrough: string[];
    insight: {
        title: string;
        body: string;
    };
    screenshotSrc?: string;
    screenshotAlt?: string;
}

export interface Decision {
    decision: string;
    alternatives: string;
    reasoning: string;
}

export interface Learning {
    title: string;
    body: string;
}

export interface Metric {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
}

export interface CTAData {
    text: string;
    buttons: { text: string; href: string; variant: "default" | "outline" }[];
}

export interface GalleryImage {
    src: string;
    alt: string;
    caption: string;
}

export interface PageData<TDiagramKey extends string = string> {
    hero: HeroData;
    situation: SituationData;
    architecture: ArchitectureData<TDiagramKey>;
    deepDives: DeepDive<TDiagramKey>[];
    decisions: Decision[];
    learnings: Learning[];
    metrics: { hero: Metric[]; supporting: Metric[] };
    gallery: GalleryImage[];
    cta: CTAData;
}
