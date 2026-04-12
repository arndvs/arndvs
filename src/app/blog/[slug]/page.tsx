import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { safeJsonLdStringify } from '@/lib/utils/safe-json-ld'
import { PostHeader } from '@/components/blog/post-header'
import { PostBody } from '@/components/blog/post-body'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
    const { data: slugs } = await sanityFetch({
        query: POST_SLUGS_QUERY,
        perspective: 'published',
        stega: false,
    })

    return (slugs || []).map((slug: string) => ({ slug }))
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const { slug } = await props.params
    const { data: post } = await sanityFetch({
        query: POST_QUERY,
        params: { slug },
        stega: false,
    })

    if (!post) return {}

    const title = post.seo?.metaTitle || post.title
    const description = post.seo?.metaDescription || post.excerpt || ''

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: post.publishedAt || undefined,
            authors: [post.author || 'Aaron Davis'],
            url: `https://arndvs.com/blog/${slug}`,
            images: [
                post.mainImage
                    ? {
                        url: urlFor(post.mainImage).width(1200).height(630).url(),
                        width: 1200,
                        height: 630,
                        alt: (post.mainImage as { alt?: string }).alt || post.title,
                    }
                    : {
                        url: '/images/og-image.jpg',
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `/blog/${slug}`,
        },
    }
}

export default async function BlogPostPage(props: { params: Params }) {
    const { slug } = await props.params
    const { data: post } = await sanityFetch({
        query: POST_QUERY,
        params: { slug },
    })

    if (!post) notFound()

    const wordsPerMinute = 200
    const charCount = post.bodyCharCount ?? 0
    const wordCount = Math.round(charCount / 5)
    const readingMinutes = Math.max(Math.ceil(wordCount / wordsPerMinute), 1)
    const readingTime = `${readingMinutes} min read`

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        url: `https://arndvs.com/blog/${slug}`,
        datePublished: post.publishedAt || undefined,
        dateModified: post._updatedAt || post.publishedAt || undefined,
        wordCount,
        inLanguage: 'en-US',
        author: {
            '@type': 'Person',
            '@id': 'https://arndvs.com/#person',
            name: post.author || 'Aaron Davis',
        },
        publisher: {
            '@type': 'Person',
            '@id': 'https://arndvs.com/#person',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://arndvs.com/blog/${slug}`,
        },
        ...(post.mainImage
            ? {
                image: urlFor(post.mainImage).width(1200).height(630).url(),
            }
            : {}),
        ...(post.categories?.length
            ? {
                keywords: post.categories.join(', '),
                articleSection: post.categories[0],
            }
            : {}),
    }

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://arndvs.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://arndvs.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://arndvs.com/blog/${slug}`,
            },
        ],
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd) }}
            />
            <article className="mx-auto max-w-7xl px-6 lg:px-8">
                <PostHeader
                    title={post.title}
                    publishedAt={post.publishedAt}
                    author={post.author}
                    categories={post.categories}
                    mainImage={post.mainImage}
                    readingTime={readingTime}
                />
                {post.body && <PostBody value={post.body} />}
            </article>
        </main>
    )
}
