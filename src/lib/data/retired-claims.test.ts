import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Figures the facts ledger (docs/reference/facts-ledger.md) has retired or marked as
 * unsourced. They reach search results and AI answers through the pages, structured data
 * and /llms.txt, so a retired figure must not come back in any page source.
 * Add a pattern here whenever the ledger retires a claim.
 */
const RETIRED: { pattern: RegExp; why: string }[] = [
    {
        pattern: /277K|276,?990/,
        why: "alignsd: line counts are disputed; use the file count (2,200+)",
    },
    {
        pattern:
            /reduc\w* (customer service )?costs? by 40%|40%.{0,20}cost reduction|"40%", label: "Cost Reduction"/i,
        why: "RipeMetrics: 40% cost reduction has no stated measurement",
    },
    { pattern: /\b328 commits\b/i, why: "ctrl+shft: commit count was never re-counted" },
];

const ROOT = resolve(__dirname, "../..");

function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === "node_modules" ? [] : sourceFiles(path);
        return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
    });
}

describe("retired claims", () => {
    const files = sourceFiles(ROOT);

    for (const { pattern, why } of RETIRED) {
        it(`no page source uses a retired figure (${why})`, () => {
            const hits = files
                .filter((f) => pattern.test(readFileSync(f, "utf8")))
                .map((f) => relative(ROOT, f));
            expect(hits).toEqual([]);
        });
    }
});
