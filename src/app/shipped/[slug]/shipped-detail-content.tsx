"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitCommitHorizontal, GitFork, Minus, Plus } from "lucide-react";

import { PortableText } from "next-sanity";
import Link from "next/link";

import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { WEEKLY_DIGEST_QUERY_RESULT } from "@/sanity/types";

type Digest = NonNullable<WEEKLY_DIGEST_QUERY_RESULT>;

function StatsBar({ stats }: { stats: Digest["stats"] }) {
    if (!stats) return null;

    const items = [
        { icon: GitCommitHorizontal, value: stats.totalCommits, label: "Commits" },
        { icon: GitFork, value: stats.reposActive, label: "Repos" },
        { icon: Plus, value: stats.linesAdded, label: "Added" },
        { icon: Minus, value: stats.linesRemoved, label: "Removed" },
    ].filter((item) => item.value);

    if (items.length === 0) return null;

    return (
        <div className="border-border bg-card flex flex-wrap gap-6 rounded-lg border p-4">
            {items.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                    <Icon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">{value!.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">{label}</span>
                </div>
            ))}
        </div>
    );
}

function ProjectCard({ project }: { project: NonNullable<Digest["projects"]>[number] }) {
    return (
        <div className="border-border bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold">{project.repoName}</h3>
                    {project.projectType && (
                        <span className="text-muted-foreground text-sm">{project.projectType}</span>
                    )}
                </div>
                {project.url && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`View ${project.repoName} on GitHub`}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>
            {project.summary && (
                <p className="text-muted-foreground mt-2 text-sm">{project.summary}</p>
            )}
            {project.skillsDemonstrated && project.skillsDemonstrated.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.skillsDemonstrated.map((skill) => (
                        <span
                            key={skill}
                            className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function DailyRefCard({ daily }: { daily: NonNullable<Digest["dailyRefs"]>[number] }) {
    return (
        <div className="border-border rounded-lg border p-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{daily.title}</span>
                <span className="text-muted-foreground text-xs">{daily.date}</span>
            </div>
            {daily.excerpt && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{daily.excerpt}</p>
            )}
        </div>
    );
}

export function ShippedDetailContent({ digest }: { digest: Digest }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <main className="min-h-screen pt-24 pb-16">
            <article className="mx-auto max-w-3xl px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/shipped"
                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                            &larr; All Digests
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <span className="text-muted-foreground text-sm">
                            {digest.weekLabel ?? digest.weekOf}
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {digest.title}
                        </h1>
                        {digest.excerpt && (
                            <p className="text-muted-foreground text-lg">{digest.excerpt}</p>
                        )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <StatsBar stats={digest.stats} />
                    </motion.div>

                    {digest.tags && digest.tags.length > 0 && (
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
                            {digest.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    )}

                    {digest.body && (
                        <motion.div
                            variants={itemVariants}
                            className="prose prose-neutral dark:prose-invert max-w-none"
                        >
                            <PortableText value={digest.body} />
                        </motion.div>
                    )}

                    {digest.projects && digest.projects.length > 0 && (
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-2xl font-bold">Projects</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {digest.projects.map((project) => (
                                    <ProjectCard key={project.repoName} project={project} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {digest.dailyRefs && digest.dailyRefs.length > 0 && (
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-2xl font-bold">Daily Breakdown</h2>
                            <div className="space-y-2">
                                {digest.dailyRefs.map((daily) => (
                                    <DailyRefCard key={daily._id} daily={daily} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </article>
        </main>
    );
}
