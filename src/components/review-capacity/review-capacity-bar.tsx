import { formatCount } from "@/lib/review-capacity/format-review-capacity";

interface ReviewCapacityBarProps {
    label: string;
    value: number;
    /** The value that fills the whole track, shared by the bars being compared. */
    maximum: number;
}

export function ReviewCapacityBar({ label, value, maximum }: ReviewCapacityBarProps) {
    const fill = maximum > 0 ? (value / maximum) * 100 : 0;

    return (
        <div className="space-y-2" data-slot="review-capacity-bar">
            <div className="flex items-baseline justify-between gap-3 text-sm">
                <span>{label}</span>
                <span className="font-mono tabular-nums">{formatCount(value, "line")}</span>
            </div>
            <div aria-hidden="true" className="bg-muted h-3 overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${fill}%` }} />
            </div>
        </div>
    );
}
