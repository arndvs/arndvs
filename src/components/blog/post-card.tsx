"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";
import type { SanityImageWithAlt } from "@/lib/types/sanity";
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

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <motion.div variants={cardVariants}>
            <Link href={`/blog/${slug}`}>
                <Card className="group hover:border-primary/50 h-full overflow-hidden transition-all hover:shadow-lg">
                    {mainImage && (
                        <div className="overflow-hidden border-b">
                            <Image
                                src={urlFor(mainImage).width(800).height(450).url()}
                                alt={(mainImage as { alt?: string }).alt || title}
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
                    <CardHeader className="space-y-3">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                            {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                            <span>{readingTime}</span>
                        </div>
                        <CardTitle className="group-hover:text-primary line-clamp-2 text-xl transition-colors">
                            {title}
                        </CardTitle>
                        {excerpt && (
                            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
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
                                        className="text-muted-foreground inline-flex items-center rounded-md border px-2 py-0.5 text-xs"
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
    );
}
