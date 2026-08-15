import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-guard";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

import { OpsConsole } from "./ops-console";

export const metadata = {
    title: "Ops Console — arndvs",
    robots: { index: false, follow: false },
};

/**
 * /ops — the LinkedIn awareness engine ops console.
 * Server component: guards auth, loads the queue, renders the client console.
 */
export default async function OpsPage() {
    await requireAuth().catch(() => {
        redirect("/login");
    });

    const store = createSanitySocialDraftStore();
    const drafts = await store.listActionable();

    return <OpsConsole drafts={drafts} />;
}
