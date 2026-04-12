import OpenAI from 'openai'

interface PostContent {
    _id: string
    title: string
    excerpt?: string
    bodyText: string
    categories?: string[]
}

export interface EnhancementResult {
    metaTitle: string
    metaDescription: string
    focusKeyword: string
    keywords: string[]
    excerpt: string
    confidence: number
}

const SYSTEM_PROMPT = `You are an SEO specialist for a software engineering portfolio blog. Generate optimized metadata for a blog post.

Rules:
- metaTitle: 50-60 characters, include primary keyword naturally
- metaDescription: 120-155 characters, compelling call to action, include keyword
- focusKeyword: single primary keyword phrase (2-4 words)
- keywords: 3-5 secondary keyword phrases relevant to the content
- excerpt: 150-250 characters, engaging summary for listing pages
- confidence: 0.0-1.0 score of how confident you are in the quality

Respond with valid JSON only. No markdown, no explanation.`

function buildUserPrompt(post: PostContent): string {
    const bodyPreview = post.bodyText.slice(0, 3000)

    return `Title: ${post.title}
Categories: ${post.categories?.join(', ') || 'none'}
Existing excerpt: ${post.excerpt || 'none'}

Body (first 3000 chars):
${bodyPreview}

Generate SEO metadata as JSON with keys: metaTitle, metaDescription, focusKeyword, keywords, excerpt, confidence`
}

export async function enhancePostSeo(post: PostContent): Promise<EnhancementResult> {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey)
        throw new Error('Missing environment variable: OPENAI_API_KEY')

    const openai = new OpenAI({ apiKey })

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildUserPrompt(post) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content

    if (!content)
        throw new Error('OpenAI returned empty response')

    const parsed = JSON.parse(content) as Record<string, unknown>

    if (!parsed.metaTitle || !parsed.metaDescription || !parsed.focusKeyword)
        throw new Error(`OpenAI returned incomplete data: ${content}`)

    return {
        metaTitle: String(parsed.metaTitle),
        metaDescription: String(parsed.metaDescription),
        focusKeyword: String(parsed.focusKeyword),
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String) : [],
        excerpt: String(parsed.excerpt || post.excerpt || ''),
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    }
}

export async function writeEnhancementToSanity(
    postId: string,
    result: EnhancementResult,
): Promise<void> {
    const { getWriteClient } = await import('@/sanity/lib/write-client')
    const writeClient = getWriteClient()

    try {
        await writeClient
            .patch(postId)
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
    } catch (err) {
        console.error(`Failed to write enhancement for post ${postId}:`, err)
        await writeClient
            .patch(postId)
            .set({
                'aiEnhancement': {
                    status: 'failed',
                    lastRunAt: new Date().toISOString(),
                    confidence: 0,
                    model: 'gpt-4o-mini',
                },
            })
            .commit()
            .catch(() => {})
        throw err
    }
}
