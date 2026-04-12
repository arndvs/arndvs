import Image from 'next/image'
import { PortableText, type PortableTextReactComponents } from 'next-sanity'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageWithAlt } from '@/lib/types/sanity'

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

const components: Partial<PortableTextReactComponents> = {
    types: {
        inlineImage: ({ value }: { value: SanityImageWithAlt & { caption?: string; asset?: { _ref: string } } }) => {
            if (!value?.asset) return null
            return (
                <figure className="my-8">
                    <Image
                        src={urlFor(value).width(1200).url()}
                        alt={value.alt || ''}
                        width={1200}
                        height={675}
                        className="rounded-lg"
                    />
                    {value.caption && (
                        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            )
        },
        codeBlock: ({ value }: { value: { code?: string; language?: string; filename?: string } }) => {
            return (
                <div className="my-6 overflow-hidden rounded-lg border bg-zinc-950">
                    {value.filename && (
                        <div className="border-b bg-zinc-900 px-4 py-2 text-xs text-zinc-400 font-mono">
                            {value.filename}
                        </div>
                    )}
                    <pre className="overflow-x-auto p-4">
                        <code
                            className={`text-sm font-mono text-zinc-100 ${value.language ? `language-${value.language}` : ''}`}
                        >
                            {value.code}
                        </code>
                    </pre>
                </div>
            )
        },
    },
    block: {
        h2: ({ children, value }) => {
            const text = value.children?.map((c) => ('text' in c ? (c as { text: string }).text : '')).join('') || ''
            const id = slugify(text)
            return (
                <h2 id={id} className="scroll-mt-20 text-2xl font-bold mt-12 mb-4">
                    <a href={`#${id}`} className="hover:underline">
                        {children}
                    </a>
                </h2>
            )
        },
        h3: ({ children, value }) => {
            const text = value.children?.map((c) => ('text' in c ? (c as { text: string }).text : '')).join('') || ''
            const id = slugify(text)
            return (
                <h3 id={id} className="scroll-mt-20 text-xl font-semibold mt-8 mb-3">
                    <a href={`#${id}`} className="hover:underline">
                        {children}
                    </a>
                </h3>
            )
        },
        h4: ({ children }) => (
            <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
                {children}
            </blockquote>
        ),
        normal: ({ children }) => (
            <p className="mb-4 leading-7 text-foreground/90">{children}</p>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{children}</code>
        ),
        'strike-through': ({ children }) => <s>{children}</s>,
        link: ({ children, value }) => {
            const href = value?.href || '#'
            const isExternal = href.startsWith('http')
            return (
                <a
                    href={href}
                    className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                    {children}
                </a>
            )
        },
    },
    list: {
        bullet: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-foreground/90">{children}</ul>
        ),
        number: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-foreground/90">{children}</ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => <li className="leading-7">{children}</li>,
        number: ({ children }) => <li className="leading-7">{children}</li>,
    },
}

interface PostBodyProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any[]
}

export function PostBody({ value }: PostBodyProps) {
    return (
        <div className="prose-custom mx-auto max-w-3xl">
            <PortableText value={value} components={components} />
        </div>
    )
}
