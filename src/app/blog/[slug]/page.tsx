import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import { PostBody } from "@/components/blog/post-body";
import { PostHeader } from "@/components/blog/post-header";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TldrBox } from "@/components/blog/tldr-box";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { generateSiteMetadata } from "@/lib/metadata";
import { estimateReadingTime } from "@/lib/utils";
import { extractHeadingsFromPortableText } from "@/lib/utils/extract-headings";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
    const { data: slugs } = await sanityFetch({
        query: POST_SLUGS_QUERY,
        perspective: "published",
        stega: false,
    });

    return (slugs || []).map((slug: string) => ({ slug }));
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const { slug } = await props.params;
    const { data: post } = await sanityFetch({
        query: POST_QUERY,
        params: { slug },
        stega: false,
    });

    if (!post) return {};

    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt || "";
    const seoImage = post.seo?.image;
    const imageSource = seoImage ?? post.mainImage;
    const image = imageSource
        ? {
              url: urlFor(imageSource).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: (imageSource as { alt?: string }).alt || post.title,
          }
        : undefined;

    return generateSiteMetadata({
        title,
        description,
        path: `/blog/${slug}`,
        type: "article",
        publishedTime: post.publishedAt || undefined,
        authors: [post.author || "Aaron Davis"],
        feedUrl: "/blog/feed.xml",
        ...(image && { images: [image] }),
        ...(post.seo?.noIndex && { robots: { index: false, follow: false } }),
    });
}

export default async function BlogPostPage(props: { params: Params }) {
    const { slug } = await props.params;
    const { data: post } = await sanityFetch({
        query: POST_QUERY,
        params: { slug },
    });

    if (!post) notFound();

    const charCount = post.bodyCharCount ?? 0;
    const wordCount = Math.round(charCount / 5);
    const readingTime = estimateReadingTime(charCount);
    const headings = post.body
        ? extractHeadingsFromPortableText(post.body as PortableTextBlock[])
        : [];
    const showToc = headings.length >= 3;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || "",
        url: `${siteConfig.url}/blog/${slug}`,
        datePublished: post.publishedAt || undefined,
        dateModified: post._updatedAt || post.publishedAt || undefined,
        wordCount,
        inLanguage: "en-US",
        author: {
            "@type": "Person",
            "@id": `${siteConfig.url}/#person`,
            name: post.author || "Aaron Davis",
        },
        publisher: {
            "@type": "Person",
            "@id": `${siteConfig.url}/#person`,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/blog/${slug}`,
        },
        ...(post.mainImage
            ? {
                  image: urlFor(post.mainImage).width(1200).height(630).url(),
              }
            : {}),
        ...(post.categories?.length
            ? {
                  keywords: post.categories.join(", "),
                  articleSection: post.categories[0],
              }
            : {}),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.url,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${siteConfig.url}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${siteConfig.url}/blog/${slug}`,
            },
        ],
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            {slug === "tailwind-indicator" && <TailwindIndicator position="bottom-right" />}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd) }}
            />
            <article className="mx-auto max-w-7xl px-6 lg:px-8">
                <PostHeader
                    title={post.title}
                    publishedAt={post.publishedAt ?? undefined}
                    author={post.author ?? undefined}
                    categories={post.categories ?? undefined}
                    mainImage={post.mainImage ?? undefined}
                    readingTime={readingTime}
                />

                {post.tldr && (
                    <div className={showToc ? "" : "mx-auto max-w-3xl"}>
                        <TldrBox tldr={post.tldr} />
                    </div>
                )}

                {showToc && (
                    <div className="lg:hidden">
                        <TableOfContents headings={headings} />
                    </div>
                )}

                <div
                    className={
                        showToc ? "lg:grid lg:grid-cols-[1fr_250px] lg:gap-12" : "mx-auto max-w-3xl"
                    }
                >
                    <div>{post.body && <PostBody value={post.body} />}</div>

                    {showToc && (
                        <aside className="hidden lg:block">
                            <TableOfContents headings={headings} />
                        </aside>
                    )}
                </div>
            </article>
        </main>
    );
}
