import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url'

interface PostHeaderProps {
    title: string
    publishedAt?: string
    author?: string
    categories?: string[]
    mainImage?: SanityImageSource & { alt?: string }
    excerpt?: string
}

function estimateReadingTime(bodyLength: number): string {
    const wordsPerMinute = 200
    const minutes = Math.ceil(bodyLength / wordsPerMinute)
    return `${Math.max(minutes, 1)} min read`
}

export function PostHeader({
    title,
    publishedAt,
    author,
    categories,
    mainImage,
}: PostHeaderProps) {
    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null

    return (
        <header className="mx-auto max-w-3xl space-y-6 pb-8">
            {/* Categories */}
            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {author && <span>{author}</span>}
                {author && formattedDate && <span aria-hidden="true">&middot;</span>}
                {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                <span aria-hidden="true">&middot;</span>
                <span>{estimateReadingTime(800)}</span>
            </div>

            {/* Main Image */}
            {mainImage && (
                <div className="overflow-hidden rounded-lg">
                    <Image
                        src={urlFor(mainImage).width(1200).height(630).url()}
                        alt={(mainImage as { alt?: string }).alt || title}
                        width={1200}
                        height={630}
                        className="w-full object-cover"
                        priority
                    />
                </div>
            )}
        </header>
    )
}
