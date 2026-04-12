'use client'

import { motion } from 'framer-motion'
import { PostCard } from '@/components/blog/post-card'
import { useAnimationVariants } from '@/lib/hooks/use-animation-variants'
import { ContactForm } from '@/components/contact-form'
import { estimateReadingTime } from '@/lib/utils'

interface Post {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    publishedAt?: string
    mainImage?: { alt?: string; asset?: { _ref: string } }
    categories?: string[]
    bodyCharCount?: number
}

export function BlogListContent({ posts }: { posts: Post[] }) {
    const { containerVariants, itemVariants } = useAnimationVariants()

    return (
        <main className="min-h-screen pt-24 pb-16">
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl font-bold tracking-tight sm:text-5xl"
                    >
                        Blog
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl text-lg text-muted-foreground"
                    >
                        Technical deep-dives on Sanity CMS, Next.js, AI engineering, and
                        lessons from building production software.
                    </motion.p>
                </motion.div>
            </section>

            {/* Posts Grid */}
            <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
                {posts.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                title={post.title}
                                slug={post.slug}
                                excerpt={post.excerpt}
                                publishedAt={post.publishedAt}
                                mainImage={post.mainImage}
                                categories={post.categories}
                                readingTime={estimateReadingTime(post.bodyCharCount ?? 0)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">
                            No posts yet. Check back soon.
                        </p>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 pt-24 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold">
                        Interested in working together?
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-muted-foreground"
                    >
                        I&apos;m available for freelance Sanity CMS and Next.js work.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <ContactForm triggerSize="lg" />
                    </motion.div>
                </motion.div>
            </section>
        </main>
    )
}
