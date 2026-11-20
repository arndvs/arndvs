import type { ReviewCapacity, Scenario } from "@/lib/review-capacity/estimate-review-capacity";
import {
    describeBalance,
    formatCount,
    formatNumber,
} from "@/lib/review-capacity/format-review-capacity";

import { ReviewCapacityBar } from "./review-capacity-bar";

interface ReviewCapacityResultProps {
    scenario: Scenario;
    estimate: ReviewCapacity;
}

export function ReviewCapacityResult({ scenario, estimate }: ReviewCapacityResultProps) {
    const maximum = Math.max(estimate.linesOpened, estimate.linesReviewable);

    return (
        <div className="space-y-8" data-slot="review-capacity-result">
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
                    {formatCount(scenario.agents, "agent")} ×{" "}
                    {formatCount(scenario.prsPerAgent, "PR")} ×{" "}
                    {formatCount(scenario.linesPerPr, "line")} ={" "}
                    {formatCount(estimate.linesOpened, "line")} opened a day
                </li>
                <li>
                    {formatCount(scenario.sittings, "sitting")} ×{" "}
                    {formatCount(scenario.linesPerSitting, "line")} ={" "}
                    {formatCount(estimate.linesReviewable, "line")} reviewable a day
                </li>
                <li>
                    {formatCount(estimate.linesReviewable, "line")} ÷ (
                    {formatCount(scenario.prsPerAgent, "PR")} ×{" "}
                    {formatCount(scenario.linesPerPr, "line")}) ={" "}
                    {formatCount(estimate.sustainableAgents, "agent")} of output
                </li>
            </ul>

            <p className="text-sm">{describeBalance(estimate.balance)}</p>
        </div>
    );
}
