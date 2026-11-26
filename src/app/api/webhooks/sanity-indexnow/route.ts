import { parseBody } from "next-sanity/webhook";
import { type NextRequest, NextResponse } from "next/server";

import { submitToIndexNow } from "@/lib/indexnow";
import { siteConfig } from "@/sanity/env";
import { webhookSecret } from "@/sanity/env.server";

interface WebhookBody {
    _type: string;
    slug?: { current?: string };
}

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<WebhookBody>(req, webhookSecret);

        if (!isValidSignature)
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

        if (!body?._type) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

        const urls: string[] = [];

        switch (body._type) {
            case "post":
                urls.push(`${siteConfig.url}/blog`);
                if (body.slug?.current) urls.push(`${siteConfig.url}/blog/${body.slug.current}`);
                break;
            default:
                return NextResponse.json({ status: 200, skipped: true, type: body._type });
        }

        if (urls.length === 0) return NextResponse.json({ status: 200, skipped: true });

        const result = await submitToIndexNow(urls);

        // eslint-disable-next-line no-console -- Operational logging for webhook submissions
        console.log(`IndexNow submitted ${urls.length} URLs:`, { urls, result });

        return NextResponse.json({
            status: 200,
            submitted: true,
            urls,
            indexNowStatus: result.status,
        });
    } catch (err) {
        console.error("IndexNow webhook error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
