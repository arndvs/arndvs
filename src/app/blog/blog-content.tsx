"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { SanityImageWithAlt } from "@/lib/types/sanity";
import { estimateReadingTime } from "@/lib/utils";

interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string;
    mainImage?: SanityImageWithAlt | null;
    categories: string[] | null;
    bodyCharCount: number;
}

export function BlogListContent({ posts }: { posts: Post[] }) {
    const { containerVariants, itemVariants } = useAnimationVariants();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-32 pb-20">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
                    <span
                        className="font-display text-foreground/[0.02] text-[20vw] font-black tracking-tighter"
                        aria-hidden="true"
                        style={{
                            transform: isVisible ? "translateY(0)" : "translateY(100px)",
                            opacity: isVisible ? 1 : 0,
                            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        BLOG
                    </span>
                </div>

                <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20">
                    <div className="mx-auto max-w-7xl">
                        <div
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                            }}
                        >
                            <span className="text-primary text-sm font-medium tracking-widest uppercase">
                                Writing
                            </span>
                        </div>

                        <h1
                            className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                            }}
                        >
                            Technical <span className="text-gradient">Deep-Dives</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            Sanity CMS, Next.js, AI engineering, and lessons from building
                            production software.
                        </p>
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
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
                                    publishedAt={post.publishedAt}
                                    mainImage={post.mainImage ?? undefined}
                                    categories={post.categories ?? undefined}
                                    readingTime={estimateReadingTime(post.bodyCharCount)}
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
                </div>
            </section>

            {/* CTA */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="max-w-3xl">
                        <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
                            Interested in working <span className="text-gradient">together</span>?
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            I work with a small number of clients on AI systems consulting and
                            full-stack development.
                        </p>
                        <div className="mt-10">
                            <Button asChild size="lg" className="group">
                                <Link href="/work-with-me">
                                    Work with me
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
