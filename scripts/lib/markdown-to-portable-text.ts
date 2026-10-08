/**
 * Minimal markdown → Portable Text converter for blog seed scripts.
 *
 * Lets a long post live in a plain .md file instead of hundreds of block() calls.
 * Supports exactly what the post schema renders:
 *   - frontmatter (`key: value`, quoted strings, `[a, b]` arrays)
 *   - `## h2`, `### h3`, paragraphs, `- bullets`, `1. numbered`
 *   - inline **strong**, *em* or _em_, `code`, [text](href)
 *   - ```lang title="file.ts" fences → codeBlock
 *   - `@embed url | title | aspectRatio | caption` → htmlEmbed
 */

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type LinkDef = { _type: "link"; _key: string; href: string; blank?: boolean };

export type PortableTextNode = Record<string, unknown> & { _type: string; _key: string };

export interface ParsedPost {
    frontmatter: Record<string, string | string[]>;
    body: PortableTextNode[];
}

export function parseFrontmatter(source: string): {
    data: Record<string, string | string[]>;
    content: string;
} {
    const match = source.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) return { data: {}, content: source };

    const data: Record<string, string | string[]> = {};
    for (const line of (match[1] ?? "").split("\n")) {
        const kv = line.match(/^(\w+):\s*(.*)$/);
        if (!kv) continue;
        const [, key = "", raw = ""] = kv;
        const value = raw.trim();
        if (value.startsWith("[") && value.endsWith("]")) {
            data[key] = value
                .slice(1, -1)
                .split(",")
                .map((v) => unquote(v.trim()))
                .filter(Boolean);
        } else {
            data[key] = unquote(value);
        }
    }
    return { data, content: source.slice(match[0].length) };
}

function unquote(value: string): string {
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1).replace(/\\"/g, '"');
    }
    return value;
}

export function markdownToPortableText(markdown: string, keyPrefix = "b"): PortableTextNode[] {
    let seq = 0;
    const key = (kind: string) => `${keyPrefix}-${kind}-${++seq}`;

    function inline(text: string): { children: Span[]; markDefs: LinkDef[] } {
        const children: Span[] = [];
        const markDefs: LinkDef[] = [];
        const pattern =
            /\*\*(.+?)\*\*|\*(.+?)\*|(?<!\w)_(.+?)_(?!\w)|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
        let last = 0;
        for (const m of text.matchAll(pattern)) {
            const index = m.index ?? 0;
            if (index > last) children.push(span(text.slice(last, index), []));
            if (m[1] !== undefined) children.push(span(m[1], ["strong"]));
            else if (m[2] !== undefined || m[3] !== undefined)
                children.push(span(m[2] ?? m[3] ?? "", ["em"]));
            else if (m[4] !== undefined) children.push(span(m[4], ["code"]));
            else {
                const linkKey = key("link");
                const href = m[6] ?? "";
                markDefs.push({
                    _type: "link",
                    _key: linkKey,
                    href,
                    ...(href.startsWith("http") ? { blank: true } : {}),
                });
                children.push(span(m[5] ?? "", [linkKey]));
            }
            last = index + m[0].length;
        }
        if (last < text.length) children.push(span(text.slice(last), []));
        return { children, markDefs };
    }

    function span(text: string, marks: string[]): Span {
        return { _type: "span", _key: key("span"), text, marks };
    }

    function textBlock(style: string, text: string, list?: { listItem: "bullet" | "number" }) {
        const { children, markDefs } = inline(text);
        return {
            _type: "block",
            _key: key("block"),
            style,
            markDefs,
            children,
            ...(list ? { listItem: list.listItem, level: 1 } : {}),
        };
    }

    const nodes: PortableTextNode[] = [];
    const lines = markdown.split("\n");
    let paragraph: string[] = [];

    const flush = () => {
        if (paragraph.length) nodes.push(textBlock("normal", paragraph.join(" ")));
        paragraph = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";

        const fence = line.match(/^```(\w+)?(?:\s+title="([^"]+)")?\s*$/);
        if (fence) {
            flush();
            const code: string[] = [];
            while (++i < lines.length && !lines[i]?.startsWith("```")) code.push(lines[i] ?? "");
            nodes.push({
                _type: "codeBlock",
                _key: key("code"),
                code: code.join("\n"),
                language: fence[1] ?? "text",
                ...(fence[2] ? { filename: fence[2] } : {}),
            });
            continue;
        }

        const embed = line.match(/^@embed\s+(.+)$/);
        if (embed) {
            flush();
            const [url, title, aspectRatio, caption] = (embed[1] ?? "")
                .split("|")
                .map((p) => p.trim());
            nodes.push({
                _type: "htmlEmbed",
                _key: key("embed"),
                url,
                title,
                aspectRatio: aspectRatio || "4 / 5",
                ...(caption ? { caption } : {}),
            });
            continue;
        }

        const heading = line.match(/^(#{2,4})\s+(.+)$/);
        if (heading) {
            flush();
            nodes.push(textBlock(`h${heading[1]?.length ?? 2}`, heading[2] ?? ""));
            continue;
        }

        const bullet = line.match(/^[-*]\s+(.+)$/);
        if (bullet) {
            flush();
            nodes.push(textBlock("normal", bullet[1] ?? "", { listItem: "bullet" }));
            continue;
        }

        const numbered = line.match(/^\d+\.\s+(.+)$/);
        if (numbered) {
            flush();
            nodes.push(textBlock("normal", numbered[1] ?? "", { listItem: "number" }));
            continue;
        }

        if (line.trim() === "") {
            flush();
            continue;
        }

        paragraph.push(line.trim());
    }
    flush();
    return nodes;
}

export function parsePost(source: string, keyPrefix?: string): ParsedPost {
    const { data, content } = parseFrontmatter(source);
    return { frontmatter: data, body: markdownToPortableText(content, keyPrefix) };
}
