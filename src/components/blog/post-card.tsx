'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useAnimationVariants } from '@/lib/hooks/use-animation-variants'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url'

interface PostCardProps {
    title: string
    slug: { current: string }
    excerpt?: string
    publishedAt?: string
    mainImage?: SanityImageSource & { alt?: string }
    categories?: string[]
    author?: string
}

function estimateReadingTime(excerpt?: string): string {
    // Rough estimate — actual body isn't available on listing
    return excerpt && excerpt.length > 200 ? '5 min read' : '3 min read'
}

export function PostCard({
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    categories,
}: PostCardProps) {
    const { cardVariants } = useAnimationVariants()

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null

    return (
        <motion.div variants={cardVariants}>
            <Link href={`/blog/${slug.current}`}>
                <Card className="group h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                    {mainImage && (
                        <div className="overflow-hidden border-b">
                            <Image
                                src={urlFor(mainImage).width(800).height(450).url()}
                                alt={(mainImage as { alt?: string }).alt || title}
                                width={800}
                                height={450}
                                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                            <span>{estimateReadingTime(excerpt)}</span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </CardTitle>
                        {excerpt && (
                            <CardDescription className="text-sm leading-relaxed line-clamp-3">
                                {excerpt}
                            </CardDescription>
                        )}
                    </CardHeader>
                    {categories && categories.length > 0 && (
                        <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                                {categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-muted-foreground"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </Link>
        </motion.div>
    )
}
