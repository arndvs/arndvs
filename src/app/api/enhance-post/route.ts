import { parseBody } from "next-sanity/webhook";
import { type NextRequest, NextResponse } from "next/server";

import { enhanceAndPersistPost } from "@/lib/ai-content-enhancement";
import { webhookSecret } from "@/sanity/env";

interface WebhookBody {
    _id: string;
    _type: string;
    title?: string;
    excerpt?: string;
    bodyText?: string;
    categories?: string[];
}

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<WebhookBody>(
            req,
            webhookSecret,
        );

        if (!isValidSignature)
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

        if (!body?._type || body._type !== "post")
            return NextResponse.json({ error: "Not a post document" }, { status: 400 });

        if (!body._id || !body.title)
            return NextResponse.json({ error: "Missing _id or title" }, { status: 400 });

        const result = await enhanceAndPersistPost({
            _id: body._id,
            title: body.title,
            excerpt: body.excerpt,
            bodyText: body.bodyText || "",
            categories: body.categories,
        });

        return NextResponse.json({
            status: 200,
            enhanced: true,
            postId: body._id,
            confidence: result.confidence,
        });
    } catch (err) {
        console.error("AI enhancement webhook error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
