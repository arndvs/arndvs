import Image from "next/image";

import type { SanityImageWithAlt } from "@/lib/types/sanity";
import { urlFor } from "@/sanity/lib/image";

interface PostHeaderProps {
    title: string;
    publishedAt?: string;
    author?: string;
    categories?: string[];
    mainImage?: SanityImageWithAlt;
    readingTime?: string;
}

export function PostHeader({
    title,
    publishedAt,
    author,
    categories,
    mainImage,
    readingTime,
}: PostHeaderProps) {
    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <header className="mx-auto max-w-3xl space-y-6 pb-8">
            {/* Categories */}
            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className="text-muted-foreground inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>

            {/* Meta */}
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
                {author && <span>{author}</span>}
                {author && formattedDate && <span aria-hidden="true">&middot;</span>}
                {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                <span aria-hidden="true">&middot;</span>
                <span>{readingTime}</span>
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
                        {...(mainImage.asset?.metadata?.lqip && {
                            placeholder: "blur" as const,
                            blurDataURL: mainImage.asset.metadata.lqip,
                        })}
                    />
                </div>
            )}
        </header>
    );
}
