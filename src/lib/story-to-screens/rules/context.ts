import type { Finding, Relationship, RuleId, Screen, ScreenType } from "../engine";

/** Where a rule sits in the process. Shown as the rule's step, and used to group the summary. */
export type RuleStage = "discover" | "model" | "design" | "plan" | "handoff";

/** A story sentence that names a second role, so the story should be split. */
export type OtherRole = {
    storyId: string;
    subject: string;
    roleOfStory: string;
    sentenceStart: number;
    sentence: string;
};

/**
 * Everything a rule needs, built once per derive. Rules read the shared maps and
 * add to them; nothing is recomputed between rules.
 */
export type RuleContext = {
    roles: Set<string>;
    rels: Relationship[];
    otherRoles: Map<string, OtherRole>;
    screens: Map<string, Screen>;
    /** Adds a screen unless one with that id already exists. Returns whether it was added. */
    addScreen: (
        id: string,
        name: string,
        type: ScreenType,
        entity: string | null,
        ruleId: Screen["ruleId"],
    ) => boolean;
    addFinding: (finding: Omit<Finding, "status">) => void;
    /** Records what the rule added and how many screens exist now. */
    record: (ruleId: RuleId, added: string[]) => void;
};

export type RuleModule = {
    id: RuleId;
    name: string;
    step: string;
    stage: RuleStage;
    explain: string;
    /** True for the screens every product needs, as opposed to the ones stories imply. */
    standard: boolean;
    apply: (ctx: RuleContext) => void;
};
