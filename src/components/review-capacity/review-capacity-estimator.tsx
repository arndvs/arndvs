"use client";

import { useState } from "react";

import {
    DEFAULT_SCENARIO_TEXT,
    estimateReviewCapacity,
    getFieldProblems,
    parseScenario,
} from "@/lib/review-capacity/estimate-review-capacity";
import type { ScenarioField, ScenarioText } from "@/lib/review-capacity/estimate-review-capacity";

import { ReviewCapacityField } from "./review-capacity-field";
import { ReviewCapacityResult } from "./review-capacity-result";

export function ReviewCapacityEstimator() {
    const [text, setText] = useState<ScenarioText>(DEFAULT_SCENARIO_TEXT);
    const scenario = parseScenario(text);
    const problems = getFieldProblems(scenario);
    const isValid = Object.keys(problems).length === 0;

    const updateField = (field: ScenarioField) => (value: string) =>
        setText((current) => ({ ...current, [field]: value }));

    return (
        <div
            className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
            data-slot="review-capacity-estimator"
        >
            <section
                aria-label="Inputs"
                className="bg-card border-border space-y-6 rounded-xl border p-6 lg:p-8"
            >
                <ReviewCapacityField
                    id="agents"
                    label="Parallel agents"
                    value={text.agents}
                    problem={problems.agents}
                    onChange={updateField("agents")}
                />
                <ReviewCapacityField
                    id="prsPerAgent"
                    label="PRs per agent a day"
                    value={text.prsPerAgent}
                    problem={problems.prsPerAgent}
                    onChange={updateField("prsPerAgent")}
                />
                <ReviewCapacityField
                    id="linesPerPr"
                    label="Lines per PR"
                    value={text.linesPerPr}
                    problem={problems.linesPerPr}
                    onChange={updateField("linesPerPr")}
                />
                <ReviewCapacityField
                    id="sittings"
                    label="Good review sittings a day"
                    value={text.sittings}
                    problem={problems.sittings}
                    onChange={updateField("sittings")}
                />
                <ReviewCapacityField
                    id="linesPerSitting"
                    label="Lines one good sitting covers"
                    value={text.linesPerSitting}
                    problem={problems.linesPerSitting}
                    onChange={updateField("linesPerSitting")}
                />
            </section>

            <section
                aria-label="Result"
                className="bg-card border-border rounded-xl border p-6 lg:p-8"
            >
                {isValid ? (
                    <ReviewCapacityResult
                        scenario={scenario}
                        estimate={estimateReviewCapacity(scenario)}
                    />
                ) : (
                    <p role="status" className="text-muted-foreground text-sm">
                        Fix the highlighted inputs to see the result.
                    </p>
                )}
            </section>
        </div>
    );
}
