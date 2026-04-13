import { PortableText, type PortableTextReactComponents } from "next-sanity";
import Image from "next/image";

import type { SanityImageWithAlt } from "@/lib/types/sanity";
import { slugify } from "@/lib/utils/extract-headings";
import { urlFor } from "@/sanity/lib/image";

const components: Partial<PortableTextReactComponents> = {
    types: {
        inlineImage: ({
            value,
        }: {
            value: SanityImageWithAlt & { caption?: string; asset?: { _ref: string } };
        }) => {
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
            value: { code?: string; language?: string; filename?: string };
        }) => {
            return (
                <div className="my-6 overflow-hidden rounded-lg border bg-zinc-950">
                    {value.filename && (
                        <div className="border-b bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-400">
                            {value.filename}
                        </div>
                    )}
                    <pre className="overflow-x-auto p-4">
                        <code
                            className={`font-mono text-sm text-zinc-100 ${value.language ? `language-${value.language}` : ""}`}
                        >
                            {value.code}
                        </code>
                    </pre>
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
        normal: ({ children }) => <p className="text-foreground/90 mb-4 leading-7">{children}</p>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">{children}</code>
        ),
        "strike-through": ({ children }) => <s>{children}</s>,
        link: ({ children, value }) => {
            const href = value?.href || "#";
            const isExternal = href.startsWith("http");
            return (
                <a
                    href={href}
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

interface PostBodyProps {
    value: any[];
}

export function PostBody({ value }: PostBodyProps) {
    return (
        <div className="prose-custom mx-auto max-w-3xl">
            <PortableText value={value} components={components} />
        </div>
    );
}
