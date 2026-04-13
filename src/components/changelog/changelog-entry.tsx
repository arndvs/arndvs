'use client'

import { useState } from 'react'
import { Plus, Sparkles, Wrench, Pencil, Server, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import type { ChangelogEntry, ChangelogEntryType } from '@/lib/types/sanity'

const typeConfig: Record<ChangelogEntryType, { icon: typeof Plus; color: string; label: string }> = {
    feature: { icon: Plus, color: 'text-green-500 bg-green-500/10 border-green-500/20', label: 'Feature' },
    improvement: { icon: Sparkles, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'Improvement' },
    fix: { icon: Wrench, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Fix' },
    content: { icon: Pencil, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', label: 'Content' },
    infrastructure: { icon: Server, color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', label: 'Infrastructure' },
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
    const [expanded, setExpanded] = useState(false)
    const config = typeConfig[entry.type] ?? typeConfig.feature
    const Icon = config.icon
    const hasBody = entry.body && entry.body.length > 0

    return (
        <div className="relative pl-10">
            {/* Timeline dot */}
            <div
                className={cn(
                    'absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border',
                    config.color,
                )}
                aria-hidden="true"
            >
                <Icon className="h-3 w-3" />
            </div>

            <div
                className={cn(
                    'rounded-lg border p-4 transition-colors',
                    entry.isHighlight
                        ? 'border-primary/20 bg-primary/5'
                        : 'border-border bg-card',
                )}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                                    config.color,
                                )}
                            >
                                <Icon className="h-2.5 w-2.5" />
                                {config.label}
                            </span>

                            {entry.relatedProject && (
                                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs">
                                    {entry.relatedProject}
                                </span>
                            )}
                        </div>

                        <h3 className="mt-1 text-base font-semibold leading-snug">{entry.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
                    </div>

                    {entry.commitHash && (
                        <a
                            href={`https://github.com/arndvs/arndvs/commit/${entry.commitHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="View commit on GitHub"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>

                {hasBody && (
                    <>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            aria-expanded={expanded}
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp className="h-3 w-3" />
                                    Hide details
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-3 w-3" />
                                    Show details
                                </>
                            )}
                        </button>

                        {expanded && (
                            <div className="mt-3 border-t border-border pt-3 prose prose-sm dark:prose-invert max-w-none">
                                <PortableText value={entry.body!} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
