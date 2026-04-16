import { parseBody } from "next-sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<{
            _type: string;
            slug?: { current?: string };
        }>(req, process.env.SANITY_WEBHOOK_SECRET);

        if (!isValidSignature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        if (!body?._type) {
            return NextResponse.json({ error: "Bad Request" }, { status: 400 });
        }

        // Revalidate by document type
        revalidateTag(body._type, { expire: 0 });

        // Revalidate specific paths based on document type
        switch (body._type) {
            case "post":
                revalidatePath("/blog");
                if (body.slug?.current) {
                    revalidatePath(`/blog/${body.slug.current}`);
                }
                revalidatePath("/sitemap.xml");
                break;
            case "changelogEntry":
                revalidatePath("/changelog");
                revalidatePath("/sitemap.xml");
                break;
            default:
                break;
        }

        return NextResponse.json({
            status: 200,
            revalidated: true,
            now: Date.now(),
            type: body._type,
        });
    } catch (err) {
        console.error("Revalidation error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
