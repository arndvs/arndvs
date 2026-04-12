import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

const INDEXNOW_KEY = 'ccef7f04d7f138c3e50cae7d7f1ede5d'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arndvs.com'

interface WebhookBody {
    _type: string
    slug?: { current?: string }
}

async function submitToIndexNow(urls: string[]) {
    const host = new URL(SITE_URL).host

    const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            host,
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
            urlList: urls,
        }),
    })

    return { status: response.status, ok: response.ok }
}

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<WebhookBody>(
            req,
            process.env.SANITY_WEBHOOK_SECRET,
        )

        if (!isValidSignature)
            return new Response('Invalid signature', { status: 401 })

        if (!body?._type)
            return new Response('Bad Request', { status: 400 })

        const urls: string[] = []

        switch (body._type) {
            case 'post':
                urls.push(`${SITE_URL}/blog`)
                if (body.slug?.current)
                    urls.push(`${SITE_URL}/blog/${body.slug.current}`)
                break
            default:
                return NextResponse.json({ status: 200, skipped: true, type: body._type })
        }

        if (urls.length === 0)
            return NextResponse.json({ status: 200, skipped: true })

        const result = await submitToIndexNow(urls)

        console.log(`IndexNow submitted ${urls.length} URLs:`, { urls, result })

        return NextResponse.json({
            status: 200,
            submitted: true,
            urls,
            indexNowStatus: result.status,
        })
    } catch (err) {
        console.error('IndexNow webhook error:', err)
        return new Response((err as Error).message, { status: 500 })
    }
}
