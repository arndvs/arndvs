/**
 * Parallel agents open code faster than one reviewer can read it. A good
 * review sitting covers a fixed number of lines, so the sittings you can
 * sustain cap how many agents you can keep fully reviewed.
 */

export const SCENARIO_FIELDS = [
    "agents",
    "prsPerAgent",
    "linesPerPr",
    "sittings",
    "linesPerSitting",
] as const;

export type ScenarioField = (typeof SCENARIO_FIELDS)[number];

export type Scenario = Record<ScenarioField, number>;

/** What each input holds as typed, before it is read as a number. */
export type ScenarioText = Record<ScenarioField, string>;

export type FieldProblems = Partial<Record<ScenarioField, string>>;

export const DEFAULT_SCENARIO_TEXT: ScenarioText = {
    agents: "3",
    prsPerAgent: "2",
    linesPerPr: "300",
    sittings: "3",
    linesPerSitting: "300",
};

/** Fields that divide the result, so zero would break the estimate. */
const ABOVE_ZERO: readonly ScenarioField[] = ["prsPerAgent", "linesPerPr"];

const toNumber = (text: string): number => (text.trim() === "" ? Number.NaN : Number(text));

/** Reads each input as a number. A blank input becomes NaN, so it is reported rather than read as zero. */
export const parseScenario = (text: ScenarioText): Scenario => ({
    agents: toNumber(text.agents),
    prsPerAgent: toNumber(text.prsPerAgent),
    linesPerPr: toNumber(text.linesPerPr),
    sittings: toNumber(text.sittings),
    linesPerSitting: toNumber(text.linesPerSitting),
});

/** Names each field the estimate cannot use, with a message for its input. */
export function getFieldProblems(scenario: Scenario): FieldProblems {
    const problems: FieldProblems = {};

    for (const field of SCENARIO_FIELDS) {
        const value = scenario[field];

        if (!Number.isFinite(value)) {
            problems[field] = "Enter a number.";
        } else if (ABOVE_ZERO.includes(field) && value <= 0) {
            problems[field] = "Enter a number above 0.";
        } else if (value < 0) {
            problems[field] = "Enter 0 or more.";
        }
    }

    return problems;
}

export interface ReviewCapacity {
    linesOpened: number;
    linesReviewable: number;
    balance: number;
    sustainableAgents: number;
    fullyReviewedAgents: number;
}

export function estimateReviewCapacity(scenario: Scenario): ReviewCapacity {
    const problems = Object.entries(getFieldProblems(scenario));

    if (problems.length > 0) {
        throw new Error(problems.map(([field, message]) => `${field}: ${message}`).join(" "));
    }

    const linesOpened = scenario.agents * scenario.prsPerAgent * scenario.linesPerPr;
    const linesReviewable = scenario.sittings * scenario.linesPerSitting;
    const linesPerAgent = scenario.prsPerAgent * scenario.linesPerPr;
    const sustainableAgents = linesReviewable / linesPerAgent;

    return {
        linesOpened,
        linesReviewable,
        balance: linesReviewable - linesOpened,
        sustainableAgents,
        // Float error can leave a whole-number ratio just under it, such as 21 ÷ (0.07 × 100) = 2.9999999999999996.
        fullyReviewedAgents: Math.floor(sustainableAgents + 1e-9),
    };
}
