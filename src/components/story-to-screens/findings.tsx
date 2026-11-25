"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RULES } from "@/lib/story-to-screens/engine";
import type { Derived, Finding, RuleId } from "@/lib/story-to-screens/engine";
import { REQUIRED_RULES } from "@/lib/story-to-screens/rules";
import { cn } from "@/lib/utils";

type Props = {
    derived: Derived;
    /** Splitting rewrites stories, so only products people own can do it. */
    canSplit: boolean;
    /** Rules the visitor turned off. */
    rulesOff: RuleId[];
    onShowSource: (finding: Finding) => void;
    onSplit: (finding: Finding) => void;
    onToggleDismissed: (id: string) => void;
    onToggleRule: (id: RuleId) => void;
};

/** The rules in order, what each added, and the findings behind them. */
export function Findings({
    derived,
    canSplit,
    rulesOff,
    onShowSource,
    onSplit,
    onToggleDismissed,
    onToggleRule,
}: Props) {
    return (
        <div className="space-y-5">
            <p className="text-muted-foreground text-sm">
                Each rule runs after the ones above it, so it only adds what they missed. Turn one
                off to see what the product looks like without it.
            </p>
            <ol className="space-y-5">
                {derived.steps.map((step, index) => {
                    const rule = RULES.find((candidate) => candidate.id === step.ruleId);
                    if (!rule) return null;
                    const findings = derived.findings.filter(
                        (finding) => finding.ruleId === step.ruleId,
                    );
                    const added = step.added.length;
                    const required = REQUIRED_RULES.has(rule.id);
                    const on = !rulesOff.includes(rule.id);

                    return (
                        <li key={step.ruleId} className="space-y-2">
                            <div className="flex items-baseline justify-between gap-3">
                                <h3 className="text-sm font-semibold">
                                    {index + 1} · {rule.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground font-mono text-xs tabular-nums">
                                        {on ? (
                                            <>
                                                {index > 0 ? (
                                                    <span
                                                        className={
                                                            added ? "text-signal font-medium" : ""
                                                        }
                                                    >
                                                        +{added} →{" "}
                                                    </span>
                                                ) : null}
                                                {step.total} screens
                                            </>
                                        ) : (
                                            "Off"
                                        )}
                                    </span>
                                    <label className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Switch
                                            checked={on}
                                            disabled={required}
                                            onCheckedChange={() => onToggleRule(rule.id)}
                                            aria-label={`Run the ${rule.name} rule`}
                                            title={
                                                required
                                                    ? "This rule can't be turned off: the screens come from the stories."
                                                    : undefined
                                            }
                                        />
                                        Run this rule
                                    </label>
                                </div>
                            </div>
                            <details className="text-muted-foreground text-xs">
                                <summary className="cursor-pointer">Why this rule</summary>
                                <p className="mt-1 leading-relaxed">
                                    {rule.explain} <span className="font-mono">{rule.step}</span>
                                </p>
                            </details>
                            {findings.map((finding) => (
                                <div
                                    key={finding.id}
                                    className={cn(
                                        "rounded-md border-l-2 py-2 pl-3 text-sm",
                                        finding.status === "dismissed"
                                            ? "border-border text-muted-foreground"
                                            : finding.ruleId === "cardinality" || finding.split
                                              ? "border-amber-500"
                                              : "border-primary",
                                    )}
                                >
                                    <p
                                        className={cn(
                                            "leading-relaxed",
                                            finding.status === "dismissed" && "line-through",
                                        )}
                                    >
                                        {finding.message}
                                    </p>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {finding.split && canSplit && finding.status === "open" ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onSplit(finding)}
                                            >
                                                Split into its own story
                                            </Button>
                                        ) : null}
                                        {finding.sources.length ? (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onShowSource(finding)}
                                            >
                                                Show where
                                            </Button>
                                        ) : null}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onToggleDismissed(finding.id)}
                                        >
                                            {finding.status === "dismissed" ? "Restore" : "Dismiss"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {index > 0 && !findings.length && !added ? (
                                <p className="text-muted-foreground text-xs">
                                    {rulesOff.includes(rule.id)
                                        ? "Turned off."
                                        : "Nothing missed here."}
                                </p>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
