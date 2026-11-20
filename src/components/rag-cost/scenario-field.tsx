"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { rangeMax } from "@/lib/rag-cost/inputs";
import type { InputDef } from "@/lib/rag-cost/inputs";
import type { RagScenario } from "@/lib/rag-cost/rag-scenario";
import { cn } from "@/lib/utils";

import { TokenCountField } from "./token-count-field";

type Props = {
    input: InputDef;
    scenario: RagScenario;
    /** Applies a change to a copy of the scenario. */
    onChange: (change: (draft: RagScenario) => void) => void;
    disabled?: boolean;
};

const percent = (value: number): string => `${Math.round(value * 100)}%`;

/** One control, drawn from its row in `inputs.ts`. */
export function ScenarioField({ input, scenario, onChange, disabled = false }: Props) {
    const id = `input-${input.param}`;
    const descriptionId = input.description ? `${id}-description` : undefined;
    const description = input.description ? (
        <p id={descriptionId} className="text-muted-foreground text-xs leading-relaxed">
            {input.description}
        </p>
    ) : null;

    if (input.kind === "count") {
        return (
            <TokenCountField
                id={id}
                label={input.label}
                hint={input.hint}
                description={input.description}
                value={input.get(scenario)}
                onChange={(value) => onChange((draft) => input.set(draft, value))}
            />
        );
    }

    if (input.kind === "toggle") {
        return (
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <Label
                        htmlFor={id}
                        className={cn(disabled ? "text-muted-foreground" : "cursor-pointer")}
                    >
                        {input.label}
                    </Label>
                    {description}
                </div>
                <Switch
                    id={id}
                    checked={input.get(scenario)}
                    onCheckedChange={(checked) => onChange((draft) => input.set(draft, checked))}
                    disabled={disabled}
                    aria-describedby={descriptionId}
                    className="mt-0.5"
                />
            </div>
        );
    }

    const value = input.get(scenario);
    const shown = input.kind === "share" ? percent(value) : String(value);

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <Label htmlFor={id}>{input.label}</Label>
                <output htmlFor={id} className="font-mono text-sm tabular-nums">
                    {shown}
                </output>
            </div>
            <input
                id={id}
                type="range"
                min={input.kind === "share" ? 0 : input.min}
                max={input.kind === "share" ? input.max : rangeMax(input, scenario)}
                step={input.kind === "share" ? input.step : 1}
                value={value}
                onChange={(event) => {
                    const next = Number(event.target.value);
                    onChange((draft) => input.set(draft, next));
                }}
                disabled={disabled}
                aria-valuetext={shown}
                aria-describedby={descriptionId}
                className="accent-primary w-full cursor-pointer"
            />
            {description}
        </div>
    );
}
