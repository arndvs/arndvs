import type { Derived, Release } from "./engine";
import { MANY_VERBS } from "./wording";

export type FlowPalette = Record<Exclude<Release, "none">, string>;

export const LIGHT_FILLS: FlowPalette = {
    mvp: "#e5f4e4",
    r2: "#e7f1fb",
    r3: "#f9eeda",
    later: "#f0efec",
};
export const DARK_FILLS: FlowPalette = {
    mvp: "#14382f",
    r2: "#16304a",
    r3: "#3a2e14",
    later: "#1c2a33",
};

/** Screen names can be typed by visitors, so only plain characters reach Mermaid. */
const label = (text: string): string =>
    text
        .replace(/[^\p{L}\p{N} ,.'()&/-]/gu, "")
        .trim()
        .slice(0, 60) || "Screen";

/**
 * The flow as Mermaid source, with nodes colored by release. Node ids are
 * generated (s0, s1, …), so `nodeIds` maps them back to screen ids.
 */
export const flowChart = (
    derived: Derived,
    fills: FlowPalette,
): { chart: string; nodeIds: Map<string, string> } => {
    const shown = derived.screens.filter((screen) => screen.release !== "none");
    const nodeIds = new Map(shown.map((screen, index) => [screen.id, `s${index}`]));
    const lines = ["flowchart LR"];

    for (const screen of shown) {
        lines.push(`  ${nodeIds.get(screen.id)}["${label(screen.name)}"]:::${screen.release}`);
    }

    const edges = new Set<string>();
    const edge = (from: string, to: string, verb?: string): void => {
        const a = nodeIds.get(from);
        const b = nodeIds.get(to);
        if (!a || !b || edges.has(`${a}>${b}`)) return;
        edges.add(`${a}>${b}`);
        lines.push(`  ${a} -->${verb ? `|${label(verb)}|` : ""} ${b}`);
    };

    edge("landing", "signup");
    edge("landing", "login");
    for (const role of derived.entities.filter((entity) => entity.isRole)) {
        edge("signup", `profile-${role.id}`);
        edge("login", `profile-${role.id}`);
    }
    for (const rel of derived.relationships) {
        const from = `profile-${rel.from}`;
        if (nodeIds.has(`new-${rel.to}`)) edge(from, `new-${rel.to}`, rel.createVerbs[0]);
        if (nodeIds.has(`list-${rel.to}`)) {
            edge(
                from,
                `list-${rel.to}`,
                rel.verbs.find((verb) => MANY_VERBS.has(verb)),
            );
        } else {
            edge(from, `view-${rel.to}`, rel.verbs[0]);
        }
        edge(`list-${rel.to}`, `view-${rel.to}`);
        edge(`new-${rel.to}`, `view-${rel.to}`);
        edge(`view-${rel.to}`, `edit-${rel.to}`, "edit");
    }

    lines.push(
        `  classDef mvp fill:${fills.mvp},stroke:#2e7d32,stroke-width:2px`,
        `  classDef r2 fill:${fills.r2},stroke:#1565c0`,
        `  classDef r3 fill:${fills.r3},stroke:#ef6c00`,
        `  classDef later fill:${fills.later},stroke:#888,stroke-dasharray: 5 5`,
    );

    return { chart: lines.join("\n"), nodeIds };
};
