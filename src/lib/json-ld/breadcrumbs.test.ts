import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/** Indexed pages that render JSON-LD must include a breadcrumb trail. */
const APP = resolve(__dirname, "../../app");
// Not indexed while SHOW_LOG_PAGES is false, so no trail is needed yet.
const EXEMPT = ["changelog/page.tsx", "shipped/page.tsx"];

function pages(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return pages(path);
        return name === "page.tsx" ? [path] : [];
    });
}

describe("breadcrumbs", () => {
    it("every page with structured data has a BreadcrumbList", () => {
        const missing = pages(APP)
            .map((p) => [relative(APP, p), readFileSync(p, "utf8")] as const)
            .filter(
                ([rel, src]) =>
                    !EXEMPT.includes(rel) && /application\/ld\+json|<JsonLd\b/.test(src),
            )
            .filter(([, src]) => !/BreadcrumbList|breadcrumbList\(/.test(src))
            .map(([rel]) => rel);
        expect(missing).toEqual([]);
    });
});
