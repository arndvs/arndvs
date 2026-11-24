import { cardinality } from "./cardinality";
import type { RuleModule } from "./context";
import { crud } from "./crud";
import { defaults } from "./defaults";
import { stories } from "./stories";
import { walk } from "./walk";

/** The rules, in the order the waterfall applies them. */
export const RULE_MODULES: readonly RuleModule[] = [stories, defaults, crud, walk, cardinality];

/** Rules that cannot be turned off: without them there is nothing to derive from. */
export const REQUIRED_RULES = new Set<RuleModule["id"]>(["stories"]);

export type { OtherRole, RuleContext, RuleModule, RuleStage } from "./context";
