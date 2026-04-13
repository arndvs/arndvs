'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationVariants } from '@/lib/hooks/use-animation-variants'
import { ChangelogTimeline } from '@/components/changelog/changelog-timeline'
import { ChangelogFilter } from '@/components/changelog/changelog-filter'
import type { ChangelogEntry, ChangelogEntryType } from '@/lib/types/sanity'

const ALL_TYPES: ChangelogEntryType[] = ['feature', 'improvement', 'fix', 'content', 'infrastructure']

export function ChangelogContent({ entries }: { entries: ChangelogEntry[] }) {
    const [activeFilter, setActiveFilter] = useState<ChangelogEntryType | null>(null)
    const { containerVariants, itemVariants } = useAnimationVariants()

    const filtered = activeFilter
        ? entries.filter((e) => e.type === activeFilter)
        : entries

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
                        Changelog
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="max-w-2xl text-lg text-muted-foreground"
                    >
                        What&apos;s new on arndvs.com
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8"
                >
                    <motion.div variants={itemVariants}>
                        <ChangelogFilter
                            types={ALL_TYPES}
                            active={activeFilter}
                            onChange={setActiveFilter}
                        />
                    </motion.div>
                </motion.div>

                <div className="mt-12">
                    <ChangelogTimeline entries={filtered} />
                </div>
            </section>
        </main>
    )
}
