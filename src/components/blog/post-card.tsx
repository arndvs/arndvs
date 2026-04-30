"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";

import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { SanityImageWithAlt } from "@/lib/types/sanity";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

interface PostCardProps {
    title: string;
    slug: string;
    excerpt?: string;
    publishedAt?: string;
    mainImage?: SanityImageWithAlt;
    categories?: string[];
    readingTime?: string;
}

export function PostCard({
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    categories,
    readingTime,
}: PostCardProps) {
    const { cardVariants } = useAnimationVariants();

    const formattedDate = publishedAt ? formatDate(publishedAt) : null;

    return (
        <motion.div variants={cardVariants}>
            <Link href={`/blog/${slug}`}>
                <article className="border-border hover:border-primary/30 group h-full overflow-hidden rounded-2xl border transition-all">
                    {mainImage && (
                        <div className="border-border overflow-hidden border-b">
                            <Image
                                src={urlFor(mainImage).width(800).height(450).url()}
                                alt={mainImage.alt || title}
                                width={800}
                                height={450}
                                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                {...(mainImage.asset?.metadata?.lqip && {
                                    placeholder: "blur" as const,
                                    blurDataURL: mainImage.asset.metadata.lqip,
                                })}
                            />
                        </div>
                    )}
                    <div className="space-y-3 p-6">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                            {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                            <span>{readingTime}</span>
                        </div>
                        <h3 className="font-display group-hover:text-primary line-clamp-2 text-xl font-bold transition-colors">
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                {excerpt}
                            </p>
                        )}
                    </div>
                    {categories && categories.length > 0 && (
                        <div className="border-border border-t px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                                {categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="border-border inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </Link>
        </motion.div>
    );
}
