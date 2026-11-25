import type { FindingSource } from "../engine";
import { MANY_VERBS, capitalize, pluralize, titleCase, withArticle } from "../wording";
import type { RuleModule } from "./context";

/** When a story acts on many of something, there must be a list to do it from. */
export const walk: RuleModule = {
    id: "walk",
    name: "Walk the story",
    step: "Step 3 · validate with stories",
    stage: "design",
    explain:
        "When a story acts on many of something (reviews applicants, browses studies), there must be a list to do it from.",
    standard: false,
    apply: ({ roles, rels, addScreen, addFinding, record }) => {
        const added: string[] = [];
        for (const rel of rels) {
            if (roles.has(rel.to) || rel.cardinality !== "many") continue;
            const manyVerb = rel.verbs.find((verb) => MANY_VERBS.has(verb));
            if (!manyVerb) continue;
            const listName = `${titleCase(pluralize(rel.to))} list`;
            if (addScreen(`list-${rel.to}`, listName, "list", rel.to, "walk", rel.sources)) {
                added.push(`list-${rel.to}`);
                addFinding({
                    id: `walk:${rel.to}`,
                    ruleId: "walk",
                    message: `“${rel.sentences[0]}” ${capitalize(withArticle(rel.from))} ${manyVerb}s many ${pluralize(rel.to)}, but there was no list to do it from. Added “${listName}”.`,
                    sources: [
                        { kind: "relationship", id: rel.id },
                        ...rel.storyIds.map((id): FindingSource => ({ kind: "story", id })),
                    ],
                });
            }
        }
        record("walk", added);
    },
};
