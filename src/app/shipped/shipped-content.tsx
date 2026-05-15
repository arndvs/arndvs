"use client";

import { motion } from "framer-motion";
import { GitCommitHorizontal, GitFork, Minus, Plus } from "lucide-react";

import Link from "next/link";

import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { WEEKLY_DIGESTS_QUERY_RESULT } from "@/sanity/types";

type WeeklyDigest = WEEKLY_DIGESTS_QUERY_RESULT[number];

function StatBadge({
    icon: Icon,
    value,
    label,
}: {
    icon: React.ComponentType<{ className?: string }>;
    value: number | null;
    label: string;
}) {
    if (!value) return null;
    return (
        <span
            className="text-muted-foreground inline-flex items-center gap-1 text-xs"
            title={label}
        >
            <Icon className="h-3 w-3" />
            {value.toLocaleString()}
        </span>
    );
}

function DigestCard({ digest }: { digest: WeeklyDigest }) {
    return (
        <Link href={`/shipped/${digest.slug}`} className="group block">
            <article className="border-border bg-card hover:bg-accent/50 rounded-lg border p-6 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                        {digest.weekLabel ?? digest.weekOf}
                    </span>
                    <div className="flex items-center gap-3">
                        <StatBadge
                            icon={GitCommitHorizontal}
                            value={digest.stats?.totalCommits ?? null}
                            label="Commits"
                        />
                        <StatBadge
                            icon={GitFork}
                            value={digest.stats?.reposActive ?? null}
                            label="Repos"
                        />
                        <StatBadge
                            icon={Plus}
                            value={digest.stats?.linesAdded ?? null}
                            label="Lines added"
                        />
                        <StatBadge
                            icon={Minus}
                            value={digest.stats?.linesRemoved ?? null}
                            label="Lines removed"
                        />
                    </div>
                </div>

                <h2 className="group-hover:text-primary text-lg font-semibold transition-colors">
                    {digest.title}
                </h2>

                {digest.excerpt && (
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                        {digest.excerpt}
                    </p>
                )}

                {digest.tags && digest.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {digest.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>
        </Link>
    );
}

export function ShippedContent({ digests }: { digests: WEEKLY_DIGESTS_QUERY_RESULT }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <main className="min-h-screen pt-24 pb-16">
            <section className="mx-auto max-w-3xl px-6 lg:px-8">
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
                        Shipped
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-muted-foreground max-w-2xl text-lg"
                    >
                        What I shipped each week — commits, projects, and progress.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-12 space-y-4"
                >
                    {digests.length === 0 ? (
                        <motion.p
                            variants={itemVariants}
                            className="text-muted-foreground py-12 text-center"
                        >
                            No digests yet. The first weekly digest will appear here soon.
                        </motion.p>
                    ) : (
                        digests.map((digest) => (
                            <motion.div key={digest._id} variants={itemVariants}>
                                <DigestCard digest={digest} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </section>
        </main>
    );
}
