import { PortableText, type PortableTextReactComponents } from "next-sanity";
import Image from "next/image";

import type { SanityImageWithAlt } from "@/lib/types/sanity";
import { slugify } from "@/lib/utils/extract-headings";
import { highlightCode, isHighlightable } from "@/lib/utils/highlight-code";
import { urlFor } from "@/sanity/lib/image";
import type { POST_QUERY_RESULT } from "@/sanity/types";

import { CopyButton } from "./copy-button";

const LANGUAGE_NAMES: Partial<Record<string, string>> = {
    typescript: "TypeScript",
    javascript: "JavaScript",
    tsx: "TSX",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    groq: "GROQ",
    bash: "Bash",
    markdown: "Markdown",
    yaml: "YAML",
    graphql: "GraphQL",
    sql: "SQL",
    python: "Python",
    text: "Plain Text",
};

function createComponents(
    highlightedBlocks: Map<string, string>,
): Partial<PortableTextReactComponents> {
    return {
        types: {
            inlineImage: ({ value }: { value: SanityImageWithAlt & { caption?: string } }) => {
                if (!value?.asset) return null;
                return (
                    <figure className="my-8">
                        <Image
                            src={urlFor(value).width(1200).url()}
                            alt={value.alt || ""}
                            width={1200}
                            height={675}
                            className="rounded-lg"
                        />
                        {value.caption && (
                            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
                                {value.caption}
                            </figcaption>
                        )}
                    </figure>
                );
            },
            codeBlock: ({
                value,
            }: {
                value: {
                    _key?: string;
                    code?: string;
                    language?: string;
                    filename?: string;
                };
            }) => {
                const highlighted = value._key ? highlightedBlocks.get(value._key) : undefined;
                const effectiveLang =
                    value.language && isHighlightable(value.language) ? value.language : undefined;
                const label =
                    value.filename ||
                    (effectiveLang
                        ? (LANGUAGE_NAMES[effectiveLang] ?? effectiveLang)
                        : value.language
                          ? value.language === "text"
                              ? "Plain Text"
                              : `${LANGUAGE_NAMES[value.language] || value.language} (plain text)`
                          : undefined);

                return (
                    <div className="group relative my-6 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                        {label && (
                            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
                                <span className="font-mono text-xs text-zinc-400">{label}</span>
                            </div>
                        )}
                        {value.code && <CopyButton code={value.code} />}
                        {highlighted ? (
                            <div
                                className="overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_pre]:!bg-transparent [&_pre]:p-4"
                                dangerouslySetInnerHTML={{
                                    __html: highlighted,
                                }}
                            />
                        ) : (
                            <pre className="overflow-x-auto p-4">
                                <code className="font-mono text-sm text-zinc-100">
                                    {value.code}
                                </code>
                            </pre>
                        )}
                    </div>
                );
            },
        },
        block: {
            h2: ({ children, value }) => {
                const text =
                    value.children
                        ?.map((c) => ("text" in c ? (c as { text: string }).text : ""))
                        .join("") || "";
                const id = slugify(text);
                return (
                    <h2 id={id} className="mt-12 mb-4 scroll-mt-20 text-2xl font-bold">
                        <a href={`#${id}`} className="hover:underline">
                            {children}
                        </a>
                    </h2>
                );
            },
            h3: ({ children, value }) => {
                const text =
                    value.children
                        ?.map((c) => ("text" in c ? (c as { text: string }).text : ""))
                        .join("") || "";
                const id = slugify(text);
                return (
                    <h3 id={id} className="mt-8 mb-3 scroll-mt-20 text-xl font-semibold">
                        <a href={`#${id}`} className="hover:underline">
                            {children}
                        </a>
                    </h3>
                );
            },
            h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>,
            blockquote: ({ children }) => (
                <blockquote className="border-primary/50 text-muted-foreground my-6 border-l-4 pl-4 italic">
                    {children}
                </blockquote>
            ),
            normal: ({ children }) => (
                <p className="text-foreground/90 mb-4 leading-7">{children}</p>
            ),
        },
        marks: {
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            code: ({ children }) => (
                <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono text-sm ring-1 ring-zinc-300/20 ring-inset">
                    {children}
                </code>
            ),
            "strike-through": ({ children }) => <s>{children}</s>,
            link: ({ children, value }) => {
                const href = value?.href || "#";
                const openInNewTab = value?.blank === true || href.startsWith("http");
                return (
                    <a
                        href={href}
                        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                        {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        {children}
                    </a>
                );
            },
        },
        list: {
            bullet: ({ children }) => (
                <ul className="text-foreground/90 my-4 ml-6 list-disc space-y-2">{children}</ul>
            ),
            number: ({ children }) => (
                <ol className="text-foreground/90 my-4 ml-6 list-decimal space-y-2">{children}</ol>
            ),
        },
        listItem: {
            bullet: ({ children }) => <li className="leading-7">{children}</li>,
            number: ({ children }) => <li className="leading-7">{children}</li>,
        },
    };
}

interface PostBodyProps {
    value: NonNullable<NonNullable<POST_QUERY_RESULT>["body"]>;
}

type PostBodyBlock = PostBodyProps["value"][number];
type CodeBlock = Extract<PostBodyBlock, { _type: "codeBlock" }> & {
    _key: string;
    code: string;
};

function isCodeBlock(block: PostBodyBlock): block is CodeBlock {
    return (
        block._type === "codeBlock" &&
        typeof (block as Record<string, unknown>)._key === "string" &&
        typeof (block as Record<string, unknown>).code === "string"
    );
}

export async function PostBody({ value }: PostBodyProps) {
    // Pre-highlight all code blocks server-side
    const highlightedBlocks = new Map<string, string>();

    const codeBlocks = value.filter(isCodeBlock);

    await Promise.all(
        codeBlocks.map(async (block) => {
            try {
                const html = await highlightCode(block.code, block.language);
                highlightedBlocks.set(block._key, html);
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error(`[Shiki] Failed to highlight block ${block._key}:`, error);
                }
            }
        }),
    );

    const components = createComponents(highlightedBlocks);

    return (
        <div className="max-w-3xl">
            <PortableText value={value} components={components} />
        </div>
    );
}
