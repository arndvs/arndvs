import { pageData as alignsd } from "@/app/projects/align-san-diego-family-chiropractic/data";
import { pageData as ctrlshft } from "@/app/projects/ctrlshft/data";
import { pageData as inkind } from "@/app/projects/inkind-first-reward-journey/data";
import { pageData as mcrdseCommerce } from "@/app/projects/mcrdse-commerce/data";
import { pageData as mcrdseContent } from "@/app/projects/mcrdse-content/data";
import { pageData as push } from "@/app/projects/push/data";
import {
    type PageData as RipeMetricsPageData,
    pageData as ripemetrics,
} from "@/app/projects/ripemetrics/data";
import { pageData as riseAwake } from "@/app/projects/rise-awake/data";
import { PROJECTS } from "@/lib/data/projects";
import type { PageData } from "@/lib/types/case-study";

/** One case study as the llms files describe it, whatever template its page uses. */
export interface LlmsCaseStudy {
    title: string;
    tagline: string;
    role: string;
    timeline: string;
    client?: string;
    stack: string[];
    narrative: string[];
    architecture?: string;
    deepDives: {
        title: string;
        subtitle: string;
        problem: string;
        walkthrough: string[];
        insight: { title: string; body: string };
    }[];
    decisions: { decision: string; alternatives: string; reasoning: string }[];
    learnings: { title: string; body: string }[];
}

/** The shared case-study template. */
export function fromCaseStudy(d: PageData): LlmsCaseStudy {
    return {
        title: d.hero.title,
        tagline: d.hero.tagline,
        role: d.situation.context.role,
        timeline: d.situation.context.timeline,
        client: d.situation.context.client,
        stack: d.situation.context.stack,
        narrative: d.situation.narrative,
        architecture: d.architecture.intro,
        deepDives: d.deepDives,
        decisions: d.decisions,
        learnings: d.learnings,
    };
}

/** RipeMetrics predates the shared template and has its own page shape. */
export function fromRipeMetrics(d: RipeMetricsPageData): LlmsCaseStudy {
    return {
        title: d.header.title,
        tagline: d.header.description,
        role: d.overview.role.value,
        timeline: d.overview.timeline.value,
        stack: d.overview.technologies.items,
        narrative: [d.challenge.description, d.solution.description],
        deepDives: d.deepDives,
        decisions: d.decisions,
        learnings: d.learnings,
    };
}

/**
 * Every listed case study, by slug. A test checks this matches PROJECTS, so a new case
 * study can't be left out of /llms.txt by accident.
 */
export const CASE_STUDIES: Record<string, LlmsCaseStudy> = {
    "align-san-diego-family-chiropractic": fromCaseStudy(alignsd),
    ctrlshft: fromCaseStudy(ctrlshft),
    "inkind-first-reward-journey": fromCaseStudy(inkind),
    "mcrdse-commerce": fromCaseStudy(mcrdseCommerce),
    "mcrdse-content": fromCaseStudy(mcrdseContent),
    push: fromCaseStudy(push),
    ripemetrics: fromRipeMetrics(ripemetrics),
    "rise-awake": fromCaseStudy(riseAwake),
};

/** Listed projects in sitemap order, each with its case study. */
export function listedCaseStudies(): { slug: string; lastModified: string; data: LlmsCaseStudy }[] {
    return PROJECTS.flatMap((p) => {
        const data = CASE_STUDIES[p.slug];
        return data ? [{ slug: p.slug, lastModified: p.lastModified, data }] : [];
    });
}
