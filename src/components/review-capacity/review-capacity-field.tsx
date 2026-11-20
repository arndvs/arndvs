import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReviewCapacityFieldProps {
    id: string;
    label: string;
    value: string;
    problem?: string;
    onChange: (value: string) => void;
}

export function ReviewCapacityField({
    id,
    label,
    value,
    problem,
    onChange,
}: ReviewCapacityFieldProps) {
    const problemId = `${id}-problem`;

    return (
        <div className="space-y-2" data-slot="review-capacity-field">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                min={0}
                step="any"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={problem ? true : undefined}
                aria-describedby={problem ? problemId : undefined}
                className="min-h-[44px] font-mono tabular-nums"
            />
            {problem ? (
                <p id={problemId} role="alert" className="text-destructive text-xs">
                    {problem}
                </p>
            ) : null}
        </div>
    );
}
