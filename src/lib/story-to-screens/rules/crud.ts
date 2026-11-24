import { capitalize, withArticle } from "../wording";
import type { RuleModule } from "./context";

/** Anything a person can create, they'll want to edit and delete. Stories rarely say so. */
export const crud: RuleModule = {
    id: "crud",
    name: "Create, edit, delete",
    step: "Step 2 · the create, edit, delete rule",
    stage: "model",
    explain:
        "Anything a person can create, they'll want to edit and delete. Stories rarely say so.",
    standard: false,
    apply: ({ rels, screens, addScreen, addFinding, record }) => {
        const added: string[] = [];
        for (const rel of rels) {
            if (!screens.has(`new-${rel.to}`)) continue;
            if (
                addScreen(
                    `edit-${rel.to}`,
                    `Edit ${rel.to} (with delete)`,
                    "edit",
                    rel.to,
                    "crud",
                    rel.sources,
                )
            ) {
                added.push(`edit-${rel.to}`);
                addFinding({
                    id: `crud:${rel.to}`,
                    ruleId: "crud",
                    message: `${capitalize(rel.from)} can create ${withArticle(rel.to)}, but no story says how to edit or delete one. Added “Edit ${rel.to}”, with delete on it.`,
                    sources: [{ kind: "relationship", id: rel.id }],
                });
            }
        }
        record("crud", added);
    },
};
