"use client";

import { motion } from "framer-motion";

import { PostCard } from "@/components/blog/post-card";
import { ContactForm } from "@/components/contact-form";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import { estimateReadingTime } from "@/lib/utils";

import type { SanityImageWithAlt } from "@/lib/types/sanity";

interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string | null;
    publishedAt?: string | null;
    mainImage?: SanityImageWithAlt | null;
    categories?: string[] | null;
    bodyCharCount?: number | null;
}

export function BlogListContent({ posts }: { posts: Post[] }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

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
                        className="text-muted-foreground max-w-2xl text-lg"
                    >
                        Technical deep-dives on Sanity CMS, Next.js, AI engineering, and lessons
                        from building production software.
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
                                excerpt={post.excerpt ?? undefined}
                                publishedAt={post.publishedAt ?? undefined}
                                mainImage={post.mainImage ?? undefined}
                                categories={post.categories ?? undefined}
                                readingTime={estimateReadingTime(post.bodyCharCount ?? 0)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-muted-foreground text-lg">
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
                    className="space-y-4 text-center"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold">
                        Interested in working together?
                    </motion.h2>
                    <motion.p variants={itemVariants} className="text-muted-foreground">
                        I&apos;m available for freelance Sanity CMS and Next.js work.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <ContactForm triggerSize="lg" />
                    </motion.div>
                </motion.div>
            </section>
        </main>
    );
}
