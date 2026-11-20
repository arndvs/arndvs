import { INPUTS } from "./inputs";
import { normalizeScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

/** Everything a shared link restores. */
export type PageState = {
    scenario: RagScenario;
    mainModelId: string;
    routedModelId: string;
};

const MAIN_MODEL_PARAM = "m";
const ROUTED_MODEL_PARAM = "r";

/** Shares are kept to four decimals, so a link never carries float noise such as 0.7000000000000001. */
const encodeNumber = (value: number): string => String(Math.round(value * 10_000) / 10_000);

/**
 * Writes only what differs from the defaults, so the default page has a
 * bare URL and a shared link stays short.
 */
export const encodeState = (state: PageState, defaults: PageState): URLSearchParams => {
    const params = new URLSearchParams();

    for (const input of INPUTS) {
        const value = input.get(state.scenario);
        if (value === input.get(defaults.scenario)) continue;

        params.set(
            input.param,
            typeof value === "boolean" ? (value ? "1" : "0") : encodeNumber(value),
        );
    }

    if (state.mainModelId !== defaults.mainModelId) params.set(MAIN_MODEL_PARAM, state.mainModelId);
    if (state.routedModelId !== defaults.routedModelId) {
        params.set(ROUTED_MODEL_PARAM, state.routedModelId);
    }

    return params;
};

/**
 * Reads a shared link over the defaults. A value that isn't a number keeps
 * its default, an unknown model keeps the default model, and the result is
 * normalized, so a hand-edited link can't break the page.
 */
export const decodeState = (
    params: URLSearchParams,
    defaults: PageState,
    modelIds: ReadonlySet<string>,
): PageState => {
    // Normalizing builds a fresh object, so the defaults are never changed.
    const scenario = normalizeScenario(defaults.scenario);

    for (const input of INPUTS) {
        const raw = params.get(input.param);
        if (raw === null) continue;

        if (input.kind === "toggle") {
            if (raw === "1" || raw === "0") input.set(scenario, raw === "1");
            continue;
        }

        const value = Number(raw);
        if (raw.trim() !== "" && Number.isFinite(value)) input.set(scenario, value);
    }

    const model = (param: string, fallback: string): string => {
        const id = params.get(param);

        return id !== null && modelIds.has(id) ? id : fallback;
    };

    return {
        scenario: normalizeScenario(scenario),
        mainModelId: model(MAIN_MODEL_PARAM, defaults.mainModelId),
        routedModelId: model(ROUTED_MODEL_PARAM, defaults.routedModelId),
    };
};
