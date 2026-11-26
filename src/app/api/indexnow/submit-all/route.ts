import { timingSafeEqual } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import sitemap from "@/app/sitemap";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * Submits every sitemap URL to IndexNow. Called by .github/workflows/indexnow.yml after
 * each successful production deploy, so pages built from code (projects, experiments,
 * services) are announced the way Sanity posts already are by the webhook.
 *
 *   curl -X POST https://arndvs.com/api/indexnow/submit-all -H "Authorization: Bearer $INDEXNOW_SUBMIT_SECRET"
 */
function authorized(req: NextRequest): boolean {
    const secret = process.env.INDEXNOW_SUBMIT_SECRET;
    const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!secret || !given) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const urls = (await sitemap()).map((entry) => entry.url);
        const result = await submitToIndexNow(urls);
        return NextResponse.json({ submitted: urls.length, indexNowStatus: result.status });
    } catch (err) {
        console.error("IndexNow submit-all error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
