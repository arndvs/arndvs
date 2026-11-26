import type { RuleModule } from "./context";

/** How many signals to report. More than three and the list stops being a signal. */
const MAX_SIGNALS = 3;

/**
 * Actions that appear in more than one story. A verb two people reach for is
 * likely a core feature, not a detail of one story.
 */
export const signals: RuleModule = {
    id: "signals",
    name: "Signals across stories",
    step: "Step 1 · read across the stories",
    stage: "discover",
    explain:
        "An action that appears in more than one story is likely a core feature. The stories keep reaching for it.",
    standard: false,
    apply: ({ signals, addFinding, record }) => {
        const repeated = signals
            .filter((signal) => signal.kind === "verb" && signal.stories.length >= 2)
            .slice(0, MAX_SIGNALS);

        for (const signal of repeated) {
            addFinding({
                id: `signals:${signal.lemma}`,
                ruleId: "signals",
                message: `“${signal.lemma}” appears in ${signal.stories.length} stories, so it's likely a core feature.`,
                sources: signal.stories.map((id) => ({ kind: "story", id })),
            });
        }

        record("signals", []);
    },
};
