"use client";

import {
    Activity,
    CreditCard,
    Database,
    GitBranch,
    Shield,
    ShoppingCart,
    Users,
} from "lucide-react";

import { createCaseStudySections } from "@/components/case-study/sections";

import { diagrams } from "./diagrams";

const subsystemIcons: Record<string, React.ElementType> = {
    "Loyalty Engine": Users,
    "Order Ingestion": ShoppingCart,
    Fulfillment: GitBranch,
    "CRM Sync": Activity,
    Payments: CreditCard,
    "Data Layer": Database,
    Security: Shield,
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
    fallbackIcon: Activity,
});
