import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<{
            _type: string
            slug?: { current?: string }
        }>(req, process.env.SANITY_WEBHOOK_SECRET)

        if (!isValidSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        if (!body?._type) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }

        // Revalidate by document type
        revalidateTag(body._type, { expire: 0 })

        // Revalidate specific paths based on document type
        switch (body._type) {
            case 'post':
                revalidatePath('/blog')
                if (body.slug?.current) {
                    revalidatePath(`/blog/${body.slug.current}`)
                }
                // Sitemap includes blog posts
                revalidatePath('/sitemap.xml')
                break
            default:
                break
        }

        return NextResponse.json({
            status: 200,
            revalidated: true,
            now: Date.now(),
            body,
        })
    } catch (err) {
        console.error('Revalidation error:', err)
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}
