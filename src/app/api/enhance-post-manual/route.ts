import { type NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { getWriteClient } from '@/sanity/lib/write-client'
import { enhancePostSeo } from '@/lib/ai-content-enhancement'

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || authHeader !== `Bearer ${process.env.SANITY_API_TOKEN}`)
        return new Response('Unauthorized', { status: 401 })

    const { postId } = (await req.json()) as { postId?: string }

    if (!postId)
        return new Response('Missing postId in request body', { status: 400 })

    const post = await client.fetch(
        `*[_type == "post" && _id == $id][0]{
            _id,
            title,
            excerpt,
            "bodyText": pt::text(body),
            categories
        }`,
        { id: postId },
    )

    if (!post)
        return new Response(`Post not found: ${postId}`, { status: 404 })

    const result = await enhancePostSeo({
        _id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        bodyText: post.bodyText || '',
        categories: post.categories,
    })

    const writeClient = getWriteClient()

    await writeClient
        .patch(post._id)
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
        postId: post._id,
        confidence: result.confidence,
        seo: {
            metaTitle: result.metaTitle,
            metaDescription: result.metaDescription,
            focusKeyword: result.focusKeyword,
            keywords: result.keywords,
        },
    })
}
