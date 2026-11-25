import { withArticle } from "../wording";
import type { RuleModule } from "./context";

/** A plural in the story against a relationship set to one is a data model that breaks. */
export const cardinality: RuleModule = {
    id: "cardinality",
    name: "One or many?",
    step: "Step 4 · one or many",
    stage: "model",
    explain:
        "If a story uses the plural but the relationship is set to one, the data model breaks the first time reality disagrees.",
    standard: false,
    apply: ({ rels, addFinding, record }) => {
        for (const rel of rels) {
            if (rel.cardinality === "one" && rel.plural) {
                addFinding({
                    id: `card:${rel.id}`,
                    ruleId: "cardinality",
                    message: `“${rel.sentences[0]}” The story says ${withArticle(rel.from)} relates to more than one ${rel.to}, but this is set to one. Set it to many, or the first customer with that setup can't use the product.`,
                    sources: [{ kind: "relationship", id: rel.id }],
                });
            }
        }
        record("cardinality", []);
    },
};
