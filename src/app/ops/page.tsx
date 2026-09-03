import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-guard";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { type JobPostingRecord } from "@/lib/engine/job-types";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";
import type { SocialDraftRecord } from "@/lib/engine/types";

import { OpsConsole } from "./ops-console";

export const metadata = {
    title: "Ops Console — arndvs",
    robots: { index: false, follow: false },
};

/**
 * /ops — the LinkedIn awareness engine ops console.
 * Server component: guards auth, loads the queue + jobs, renders the client console.
 */
export default async function OpsPage() {
    await requireAuth().catch(() => {
        redirect("/login");
    });

    const store = createSanitySocialDraftStore();
    let drafts: SocialDraftRecord[] = [];
    try {
        drafts = await store.listActionable();
    } catch (err) {
        console.error("ops: failed to load drafts", err);
        // A missing SANITY_API_TOKEN or schema issue shouldn't 500 the whole
        // page — render an empty queue so the console still loads.
        drafts = [];
    }

    let jobs: JobPostingRecord[] = [];
    try {
        const jobStore = createSanityJobPostingStore();
        // Load only actionable (non-terminal) jobs, capped — terminal
        // skip/expired rows are not useful in the triage console.
        jobs = await jobStore.listActionable(100);
    } catch {
        // Job store is optional — the queue works even if jobPosting schema is not deployed.
    }

    return <OpsConsole drafts={drafts} jobs={jobs} />;
}
