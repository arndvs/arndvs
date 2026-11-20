import { formatTokenCount } from "@/lib/rag-cost/format";
import { TOKENS_PER_MINUTE_LIMIT } from "@/lib/rag-cost/latency";
import type { CapacityEstimate, LatencyEstimate, ModelLoad } from "@/lib/rag-cost/latency";

type Props = {
    latency: LatencyEstimate;
    capacity: CapacityEstimate;
    names: Record<ModelLoad["model"], string>;
};

const seconds = (ms: number): string => `${(ms / 1000).toFixed(ms < 10_000 ? 2 : 1)} s`;

const headroom = (load: ModelLoad): string =>
    load.headroom < 1 ? "Over the limit now" : `${load.headroom.toFixed(1)}× today’s traffic`;

/** Rough planning signals: how long an answer takes, and where scale runs out first. */
export function LatencyCapacity({ latency, capacity, names }: Props) {
    const total = latency.completeMs;

    return (
        <section aria-labelledby="scale-heading" className="space-y-5">
            <div className="space-y-1">
                <h3
                    id="scale-heading"
                    className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                >
                    Latency and capacity
                </h3>
                <p className="text-muted-foreground text-xs">
                    Rough planning signals for a question the cache didn’t answer. Replace the
                    assumptions below with your own measurements.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <p>
                            <span className="text-muted-foreground block text-xs">
                                First word appears
                            </span>
                            <span className="font-display stat-number text-3xl">
                                {seconds(latency.firstTokenMs)}
                            </span>
                        </p>
                        <p>
                            <span className="text-muted-foreground block text-xs">Full answer</span>
                            <span className="font-display stat-number text-3xl">
                                {seconds(latency.completeMs)}
                            </span>
                        </p>
                    </div>
                    <div
                        aria-hidden="true"
                        className="bg-muted relative h-3 overflow-hidden rounded-full"
                    >
                        {latency.stages.map((stage, index) => (
                            <span
                                key={stage.label}
                                className={
                                    stage.label === "Stream the answer"
                                        ? "bg-primary/40 absolute inset-y-0"
                                        : index % 2 === 0
                                          ? "bg-primary absolute inset-y-0"
                                          : "bg-primary/70 absolute inset-y-0"
                                }
                                style={{
                                    left: `${(stage.startMs / total) * 100}%`,
                                    width: `${(stage.durationMs / total) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <ol className="text-muted-foreground space-y-1 font-mono text-xs tabular-nums">
                        {latency.stages.map((stage) => (
                            <li key={stage.label} className="flex justify-between gap-3">
                                <span>{stage.label}</span>
                                <span>
                                    {Math.round(stage.startMs)}–
                                    {Math.round(stage.startMs + stage.durationMs)} ms
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

                <dl className="divide-border divide-y text-sm">
                    <div className="flex justify-between gap-3 pb-2.5">
                        <dt className="text-muted-foreground">Questions a second at peak</dt>
                        <dd className="font-mono tabular-nums">
                            {capacity.peakRequestsPerSecond.toFixed(1)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-3 py-2.5">
                        <dt className="text-muted-foreground">Answers streaming at once</dt>
                        <dd className="font-mono tabular-nums">
                            {capacity.peakInFlight.toFixed(1)}
                        </dd>
                    </div>
                    {capacity.loads.map((load) => (
                        <div key={load.model} className="flex justify-between gap-3 py-2.5">
                            <dt className="text-muted-foreground">
                                {names[load.model]}, peak tokens a minute
                            </dt>
                            <dd className="text-right font-mono tabular-nums">
                                {formatTokenCount(Math.round(load.tokensPerMinute))}
                                <span className="text-muted-foreground block text-xs">
                                    of {formatTokenCount(TOKENS_PER_MINUTE_LIMIT)}
                                </span>
                            </dd>
                        </div>
                    ))}
                    {capacity.firstLimit ? (
                        <div className="flex justify-between gap-3 pt-2.5">
                            <dt className="font-medium">
                                First to hit its limit: {names[capacity.firstLimit.model]}
                            </dt>
                            <dd
                                className={
                                    capacity.firstLimit.headroom < 1
                                        ? "text-destructive font-mono tabular-nums"
                                        : "font-mono tabular-nums"
                                }
                            >
                                {headroom(capacity.firstLimit)}
                            </dd>
                        </div>
                    ) : null}
                </dl>
            </div>
        </section>
    );
}
