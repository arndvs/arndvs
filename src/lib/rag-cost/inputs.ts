import type { RagScenario } from "./rag-scenario";

/** Where an input appears on the page. */
export type InputGroup = "workload" | "routing" | "levers" | "decisions";

type InputBase = {
    label: string;
    /** A short note beside the label, such as "tokens". */
    hint?: string;
    description?: string;
    group: InputGroup;
    /** The query-string key that saves this input in a shared link. Never reuse one. */
    param: string;
    /** Hides the input while it has no effect, such as the filter's sizes with the filter off. */
    shownWhen?: (scenario: RagScenario) => boolean;
};

/** A count typed with shorthand such as 250k. */
export type CountInput = InputBase & {
    kind: "count";
    get: (scenario: RagScenario) => number;
    set: (scenario: RagScenario, value: number) => void;
};

/** A small whole number on a slider. */
export type RangeInput = InputBase & {
    kind: "range";
    min: number;
    /** A number, or a function when the limit depends on another input. */
    max: number | ((scenario: RagScenario) => number);
    get: (scenario: RagScenario) => number;
    set: (scenario: RagScenario, value: number) => void;
};

/** A share from 0 to `max`, shown as a percentage. */
export type ShareInput = InputBase & {
    kind: "share";
    max: number;
    step: number;
    get: (scenario: RagScenario) => number;
    set: (scenario: RagScenario, value: number) => void;
};

export type ToggleInput = InputBase & {
    kind: "toggle";
    get: (scenario: RagScenario) => boolean;
    set: (scenario: RagScenario, value: boolean) => void;
};

export type InputDef = CountInput | RangeInput | ShareInput | ToggleInput;

/**
 * Every input on the page, in display order. Controls, shared links, and
 * later the change log and challenges all read this table, so a new input
 * goes here and nowhere else. Setters change the scenario in place.
 */
export const INPUTS: readonly InputDef[] = [
    {
        kind: "count",
        group: "workload",
        param: "q",
        label: "Questions",
        hint: "a day",
        get: (s) => s.queriesPerDay,
        set: (s, v) => {
            s.queriesPerDay = v;
        },
    },
    {
        kind: "count",
        group: "workload",
        param: "sys",
        label: "System prompt",
        hint: "tokens",
        get: (s) => s.prompt.systemTokens,
        set: (s, v) => {
            s.prompt.systemTokens = v;
        },
    },
    {
        kind: "count",
        group: "workload",
        param: "qt",
        label: "Question",
        hint: "tokens",
        get: (s) => s.prompt.questionTokens,
        set: (s, v) => {
            s.prompt.questionTokens = v;
        },
    },
    {
        kind: "count",
        group: "workload",
        param: "ct",
        label: "Chunk size",
        hint: "tokens",
        get: (s) => s.prompt.chunkTokens,
        set: (s, v) => {
            s.prompt.chunkTokens = v;
        },
    },
    {
        kind: "range",
        group: "workload",
        param: "ch",
        label: "Chunks sent",
        description: "Retrieved chunks added to each prompt.",
        min: 0,
        max: 20,
        get: (s) => s.prompt.chunks,
        set: (s, v) => {
            s.prompt.chunks = v;
        },
    },
    {
        kind: "count",
        group: "workload",
        param: "out",
        label: "Answer",
        hint: "tokens",
        description: "Includes reasoning tokens.",
        get: (s) => s.prompt.outputTokens,
        set: (s, v) => {
            s.prompt.outputTokens = v;
        },
    },
    {
        kind: "share",
        group: "routing",
        param: "rs",
        label: "Sent to the routed model",
        max: 1,
        step: 0.05,
        get: (s) => s.routing.share,
        set: (s, v) => {
            s.routing.share = v;
        },
    },
    {
        kind: "share",
        group: "routing",
        param: "ra",
        label: "Router accuracy",
        description:
            "How often the router picks the right model. Mistakes aren’t priced, but they’re counted.",
        max: 1,
        step: 0.01,
        shownWhen: (s) => s.routing.share > 0,
        get: (s) => s.routing.accuracy,
        set: (s, v) => {
            s.routing.accuracy = v;
        },
    },
    {
        kind: "share",
        group: "levers",
        param: "hit",
        label: "Answered from a response cache",
        description: "Repeat questions served without calling any model.",
        max: 0.9,
        step: 0.05,
        get: (s) => s.responseCacheHitRate,
        set: (s, v) => {
            s.responseCacheHitRate = v;
        },
    },
    {
        kind: "toggle",
        group: "levers",
        param: "pc",
        label: "Cache the system prompt",
        description: "Bills the system prompt at the cached-input price after each cache write.",
        get: (s) => s.promptCaching,
        set: (s, v) => {
            s.promptCaching = v;
        },
    },
    {
        kind: "toggle",
        group: "decisions",
        param: "jf",
        label: "Filter retrieved chunks",
        description:
            "Scores a wider set of chunks and keeps the best, instead of a similarity cutoff.",
        get: (s) => s.decisions.filter.enabled,
        set: (s, v) => {
            s.decisions.filter.enabled = v;
        },
    },
    {
        kind: "range",
        group: "decisions",
        param: "fc",
        label: "Chunks retrieved for scoring",
        min: 1,
        max: 20,
        shownWhen: (s) => s.decisions.filter.enabled,
        get: (s) => s.decisions.filter.candidates,
        set: (s, v) => {
            s.decisions.filter.candidates = v;
            // The filter can't keep more chunks than it scores.
            s.decisions.filter.keep = Math.min(s.decisions.filter.keep, v);
        },
    },
    {
        kind: "range",
        group: "decisions",
        param: "fk",
        label: "Chunks kept",
        min: 1,
        max: (s) => s.decisions.filter.candidates,
        shownWhen: (s) => s.decisions.filter.enabled,
        // Shown as it's used: never more than the chunks scored, even from a hand-edited link.
        get: (s) => Math.min(s.decisions.filter.keep, s.decisions.filter.candidates),
        set: (s, v) => {
            s.decisions.filter.keep = v;
        },
    },
    {
        kind: "toggle",
        group: "decisions",
        param: "jg",
        label: "Skip questions the chunks can’t answer",
        description: "Replies that it doesn’t know, or escalates, instead of generating an answer.",
        get: (s) => s.decisions.gate.enabled,
        set: (s, v) => {
            s.decisions.gate.enabled = v;
        },
    },
    {
        kind: "share",
        group: "decisions",
        param: "gr",
        label: "Questions the chunks can’t answer",
        max: 0.5,
        step: 0.01,
        shownWhen: (s) => s.decisions.gate.enabled,
        get: (s) => s.decisions.gate.unanswerableRate,
        set: (s, v) => {
            s.decisions.gate.unanswerableRate = v;
        },
    },
    {
        kind: "toggle",
        group: "decisions",
        param: "jr",
        label: "Route each question",
        description:
            "Classifies every question instead of a keyword rule. Needs a routed share above 0%.",
        get: (s) => s.decisions.route,
        set: (s, v) => {
            s.decisions.route = v;
        },
    },
    {
        kind: "toggle",
        group: "decisions",
        param: "jm",
        label: "Confirm cache hits",
        description:
            "Checks that a cached answer fits the new question. It costs money and changes no volume: its payoff is fewer wrong cached answers.",
        get: (s) => s.decisions.cacheMatch,
        set: (s, v) => {
            s.decisions.cacheMatch = v;
        },
    },
];

/** A range input's upper limit for this scenario. */
export const rangeMax = (input: RangeInput, scenario: RagScenario): number =>
    typeof input.max === "function" ? input.max(scenario) : input.max;

export const inputsIn = (group: InputGroup): InputDef[] =>
    INPUTS.filter((input) => input.group === group);
