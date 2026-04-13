"use client";

import { motion } from "framer-motion";

import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { ChangelogEntry } from "@/lib/types/sanity";

import { ChangelogEntryCard } from "./changelog-entry";

function groupByMonth(entries: ChangelogEntry[]): Map<string, ChangelogEntry[]> {
    const groups = new Map<string, ChangelogEntry[]>();

    for (const entry of entries) {
        const d = new Date(entry.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const existing = groups.get(key);

        if (existing) existing.push(entry);
        else groups.set(key, [entry]);
    }

    return groups;
}

function formatMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ChangelogTimeline({ entries }: { entries: ChangelogEntry[] }) {
    const { staggerContainerVariants, itemVariants } = useAnimationVariants();
    const groups = groupByMonth(entries);

    if (entries.length === 0) {
        return <p className="text-muted-foreground py-12 text-center">No changelog entries yet.</p>;
    }

    return (
        <div className="relative">
            {/* Vertical timeline line */}
            <div className="bg-border absolute top-0 bottom-0 left-3 w-px" aria-hidden="true" />

            <div className="space-y-12">
                {Array.from(groups.entries()).map(([monthKey, monthEntries]) => (
                    <motion.section
                        key={monthKey}
                        variants={staggerContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-muted-foreground mb-6 pl-10 text-sm font-semibold tracking-wider uppercase"
                        >
                            {formatMonthLabel(monthKey)}
                        </motion.h2>

                        <div className="space-y-6">
                            {monthEntries.map((entry) => (
                                <motion.div key={entry._id} variants={itemVariants}>
                                    <ChangelogEntryCard entry={entry} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </div>
        </div>
    );
}
