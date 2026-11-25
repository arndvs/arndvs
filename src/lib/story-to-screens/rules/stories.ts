import { pluralize, titleCase } from "../wording";
import type { RuleModule } from "./context";

/** A profile for every role, a detail screen for everything a role acts on, and a create screen wherever a story creates something. */
export const stories: RuleModule = {
    id: "stories",
    name: "From the stories",
    step: "Step 3 · list the screens",
    stage: "discover",
    explain:
        "A profile for every role, a detail screen for everything a role acts on, and a create screen wherever a story creates something. One story per role.",
    standard: false,
    apply: ({ roles, rels, otherRoles, roleSources, addScreen, addFinding, record }) => {
        const added: string[] = [];
        for (const role of roles) {
            const source = roleSources.get(role);
            if (
                addScreen(
                    `profile-${role}`,
                    `${titleCase(role)} profile`,
                    "view",
                    role,
                    "stories",
                    source ? [source] : [],
                )
            ) {
                added.push(`profile-${role}`);
            }
        }
        for (const rel of rels) {
            if (roles.has(rel.to)) continue;
            if (
                addScreen(
                    `view-${rel.to}`,
                    `${titleCase(rel.to)} detail`,
                    "view",
                    rel.to,
                    "stories",
                    rel.sources,
                )
            ) {
                added.push(`view-${rel.to}`);
            }
            if (
                rel.createVerbs.length &&
                addScreen(
                    `new-${rel.to}`,
                    `New ${rel.to}`,
                    "create",
                    rel.to,
                    "stories",
                    rel.sources,
                )
            ) {
                added.push(`new-${rel.to}`);
            }
        }
        for (const other of otherRoles.values()) {
            addFinding({
                id: `split:${other.storyId}:${other.subject}`,
                ruleId: "stories",
                split: {
                    storyId: other.storyId,
                    subject: other.subject,
                    sentenceStart: other.sentenceStart,
                },
                message: `“${other.sentence}” This part is about ${pluralize(other.subject)}, not the ${other.roleOfStory}. One story per role: split it into its own ${titleCase(other.subject)} story so it can say what ${pluralize(other.subject)} do today.`,
                sources: [{ kind: "story", id: other.storyId }],
            });
        }
        record("stories", added);
    },
};
