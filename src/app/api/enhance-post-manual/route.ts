import { type NextRequest, NextResponse } from "next/server";

import { enhancePostSeo, writeEnhancementToSanity } from "@/lib/ai-content-enhancement";
import { safeCompare } from "@/lib/auth";
import { client } from "@/sanity/lib/client";

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
        const { postId } = (await req.json()) as { postId?: string };

        if (!postId)
            return NextResponse.json({ error: "Missing postId in request body" }, { status: 400 });

        const post = await client.fetch(
            `*[_type == "post" && _id == $id][0]{
                _id,
                title,
                excerpt,
                "bodyText": pt::text(body),
                categories
            }`,
            { id: postId },
        );

        if (!post) return NextResponse.json({ error: `Post not found: ${postId}` }, { status: 404 });

        const result = await enhancePostSeo({
            _id: post._id,
            title: post.title,
            excerpt: post.excerpt,
            bodyText: post.bodyText || "",
            categories: post.categories,
        });

        await writeEnhancementToSanity(post._id, result);

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
