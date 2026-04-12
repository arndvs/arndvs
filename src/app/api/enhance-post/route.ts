import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { getWriteClient } from '@/sanity/lib/write-client'
import { enhancePostSeo } from '@/lib/ai-content-enhancement'

interface WebhookBody {
    _id: string
    _type: string
    title?: string
    excerpt?: string
    bodyText?: string
    categories?: string[]
}

export async function POST(req: NextRequest) {
    try {
        const { body, isValidSignature } = await parseBody<WebhookBody>(
            req,
            process.env.SANITY_WEBHOOK_SECRET,
        )

        if (!isValidSignature)
            return new Response('Invalid signature', { status: 401 })

        if (!body?._type || body._type !== 'post')
            return new Response('Not a post document', { status: 400 })

        if (!body._id || !body.title)
            return new Response('Missing _id or title', { status: 400 })

        const result = await enhancePostSeo({
            _id: body._id,
            title: body.title,
            excerpt: body.excerpt,
            bodyText: body.bodyText || '',
            categories: body.categories,
        })

        const writeClient = getWriteClient()

        await writeClient
            .patch(body._id)
            .set({
                seo: {
                    _type: 'seo',
                    metaTitle: result.metaTitle,
                    metaDescription: result.metaDescription,
                    focusKeyword: result.focusKeyword,
                    keywords: result.keywords,
                },
                excerpt: result.excerpt,
                'aiEnhancement': {
                    status: 'completed',
                    lastRunAt: new Date().toISOString(),
                    confidence: result.confidence,
                    model: 'gpt-4o-mini',
                },
            })
            .commit()

        return NextResponse.json({
            status: 200,
            enhanced: true,
            postId: body._id,
            confidence: result.confidence,
        })
    } catch (err) {
        console.error('AI enhancement webhook error:', err)
        return new Response((err as Error).message, { status: 500 })
    }
}
