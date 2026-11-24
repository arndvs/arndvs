import type { RuleModule } from "./context";

/** Words a screen name can share with the stories and still count as backed by one. */
const words = (text: string): string[] =>
    text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2);

/** A screen added by hand that no story mentions. Reported, never removed. */
export const trace: RuleModule = {
    id: "trace",
    name: "Trace to a story",
    step: "Step 5 · trace every screen",
    stage: "handoff",
    explain:
        "Every screen should trace back to a story. A screen added by hand that no story mentions is reported here, so you know it isn't backed by one.",
    standard: false,
    afterManualScreens: true,
    apply: ({ roles, rels, manualScreens, addFinding, record }) => {
        const marked = new Set<string>();
        for (const role of roles) for (const word of words(role)) marked.add(word);
        for (const rel of rels) {
            for (const word of words(rel.from)) marked.add(word);
            for (const word of words(rel.to)) marked.add(word);
            for (const verb of rel.verbs) marked.add(verb.toLowerCase());
        }

        for (const screen of manualScreens) {
            if (words(screen.name).some((word) => marked.has(word))) continue;
            addFinding({
                id: `trace:${screen.id}`,
                ruleId: "trace",
                message: `No story mentions “${screen.name}”. Keep it, but know it isn't backed by a story.`,
                sources: [],
            });
        }

        record("trace", []);
    },
};
