import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-guard";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { type JobPostingRecord } from "@/lib/engine/job-types";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

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
    const drafts = await store.listActionable();

    let jobs: JobPostingRecord[] = [];
    try {
        const jobStore = createSanityJobPostingStore();
        jobs = await jobStore.listByStatus();
    } catch {
        // Job store is optional — the queue works even if jobPosting schema is not deployed.
    }

    return <OpsConsole drafts={drafts} jobs={jobs} />;
}
