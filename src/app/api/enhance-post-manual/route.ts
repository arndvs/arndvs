import { type NextRequest, NextResponse } from "next/server";

import { enhanceAndPersistPost } from "@/lib/ai-content-enhancement";
import { safeCompare } from "@/lib/auth";
import { client } from "@/sanity/lib/client";
import { ENHANCE_POST_QUERY } from "@/sanity/lib/queries";

function isAuthorized(authHeader: string | null): boolean {
    const secret = process.env.ENHANCE_POST_SECRET;

    if (!secret) throw new Error("Missing environment variable: ENHANCE_POST_SECRET");

    if (!authHeader?.startsWith("Bearer ")) return false;

    return safeCompare(authHeader.slice(7), secret);
}

export async function POST(req: NextRequest) {
    try {
        if (!isAuthorized(req.headers.get("authorization")))
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!body || typeof body !== "object" || Array.isArray(body))
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

        const rawPostId = (body as { postId?: unknown }).postId;
        const postId = typeof rawPostId === "string" ? rawPostId.trim() : "";

        if (!postId)
            return NextResponse.json({ error: "Missing postId in request body" }, { status: 400 });

        const post = await client.withConfig({ useCdn: false }).fetch(
            ENHANCE_POST_QUERY,
            { id: postId },
        );

        if (!post)
            return NextResponse.json({ error: `Post not found: ${postId}` }, { status: 404 });

        const result = await enhanceAndPersistPost({
            _id: post._id,
            title: post.title,
            excerpt: post.excerpt ?? undefined,
            bodyText: post.bodyText || "",
            categories: post.categories ?? undefined,
        });

        return NextResponse.json({
            status: 200,
            enhanced: true,
            postId: post._id,
            confidence: result.confidence,
            seo: {
                metaTitle: result.metaTitle,
                metaDescription: result.metaDescription,
                focusKeyword: result.focusKeyword,
                keywords: result.keywords,
            },
        });
    } catch (err) {
        console.error("Manual enhancement error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
