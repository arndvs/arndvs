import { describe, expect, it } from "vitest";

import { derive } from "./engine";
import { LIGHT_FILLS, flowChart } from "./flow";
import { fromPreset } from "./presets";

describe("flowChart", () => {
    it("draws every kept screen and leaves out the ones not needed", () => {
        const derived = derive(fromPreset("tester"));
        const { chart, nodeIds } = flowChart(derived, LIGHT_FILLS);

        expect(nodeIds.has("list-applicant")).toBe(true);
        expect(nodeIds.has("view-survey")).toBe(false);
        expect(chart).toContain("classDef mvp");
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
