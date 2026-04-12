import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { BlogListContent } from './blog-content'

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'Technical articles on Sanity CMS, Next.js, AI engineering, and modern web development by Aaron Davis.',
}

export default async function BlogPage() {
    const { data: posts } = await sanityFetch({ query: POSTS_QUERY })

    return <BlogListContent posts={posts} />
}
