import type { ReviewCapacity, Scenario } from "@/lib/review-capacity/estimate-review-capacity";
import {
    countOf,
    describeBalance,
    formatNumber,
} from "@/lib/review-capacity/format-review-capacity";

import { ReviewCapacityBar } from "./review-capacity-bar";

type Props = {
    scenario: Scenario;
    estimate: ReviewCapacity;
};

/** The headline count, the two bars, and the arithmetic behind them. */
export function ReviewCapacityResult({ scenario, estimate }: Props) {
    const maximum = Math.max(estimate.linesOpened, estimate.linesReviewable);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Agents kept fully reviewed
                </p>
                <p className="font-display text-primary stat-number mt-1 text-6xl lg:text-7xl">
                    {formatNumber(estimate.fullyReviewedAgents)}
                </p>
            </div>

            <div className="space-y-4">
                <ReviewCapacityBar
                    label="Opened a day"
                    value={estimate.linesOpened}
                    maximum={maximum}
                />
                <ReviewCapacityBar
                    label="Reviewable a day"
                    value={estimate.linesReviewable}
                    maximum={maximum}
                />
            </div>

            <ul className="text-muted-foreground space-y-2 font-mono text-sm leading-relaxed">
                <li>
                    {countOf(scenario.agents, "agent")} × {countOf(scenario.prsPerAgent, "PR")} ×{" "}
                    {countOf(scenario.linesPerPr, "line")} = {countOf(estimate.linesOpened, "line")}{" "}
                    opened a day
                </li>
                <li>
                    {countOf(scenario.sittings, "sitting")} ×{" "}
                    {countOf(scenario.linesPerSitting, "line")} ={" "}
                    {countOf(estimate.linesReviewable, "line")} reviewable a day
                </li>
                <li>
                    {countOf(estimate.linesReviewable, "line")} ÷ (
                    {countOf(scenario.prsPerAgent, "PR")} × {countOf(scenario.linesPerPr, "line")})
                    = {countOf(estimate.sustainableAgents, "agent")} of output
                </li>
            </ul>

            <p className="text-sm">{describeBalance(estimate.balance)}</p>
        </div>
    );
}
