import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";

/** Renders one JSON-LD block. Pass a node or a `graph(...)` from `@/lib/json-ld`. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
        />
    );
}
