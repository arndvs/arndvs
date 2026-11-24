import { describe, expect, it } from "vitest";

import { derive } from "./engine";
import { LIGHT_FILLS, flowChart } from "./flow";
import { fromPreset } from "./presets";

describe("flowChart", () => {
    it("draws every screen in the product and leaves out the judged ones", () => {
        const derived = derive(fromPreset("tester"));
        const { chart, nodeIds } = flowChart(derived, LIGHT_FILLS);

        expect(nodeIds.has("list-applicant")).toBe(true);
        expect(nodeIds.has("view-survey")).toBe(false);
        expect(chart).toContain("classDef mvp");
    });

    it("re-points a folded screen's edges to its parent", () => {
        const product = fromPreset("tester");
        // view-survey is folded into view-study by the preset, so its edges land there.
        const { chart, nodeIds } = flowChart(derive(product), LIGHT_FILLS);

        expect(chart).not.toContain("Survey detail");
        expect(chart).toContain("Study detail");
        expect(nodeIds.has("view-survey")).toBe(false);
        expect(nodeIds.has("view-study")).toBe(true);
    });

    it("draws a screen the visitor un-judged", () => {
        const product = fromPreset("tester");
        delete product.choices.judgments["view-survey"];
        const { nodeIds } = flowChart(derive(product), LIGHT_FILLS);

        expect(nodeIds.has("view-survey")).toBe(true);
    });

    it("strips characters Mermaid or HTML would read from screen names typed by visitors", () => {
        const product = fromPreset("tester");
        product.choices.manualScreens.push({
            id: "manual-1",
            name: 'Billing"]; click s0 call alert(1) <img src=x onerror=alert(1)>',
        });
        const { chart } = flowChart(derive(product), LIGHT_FILLS);
        const line = chart.split("\n").find((entry) => entry.includes("Billing"));

        expect(line).toBeDefined();
        expect(line).not.toMatch(/[<>;]/);
        expect(line?.match(/"/g)).toHaveLength(2);
    });
});
