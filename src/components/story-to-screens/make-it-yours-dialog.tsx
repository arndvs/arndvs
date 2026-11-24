"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChoose: (mode: "copy" | "blank") => void;
};

const choiceClass =
    "border-border hover:border-primary focus-visible:ring-ring w-full rounded-lg border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none";

/** Copy the example on screen, or start with one empty story. */
export function MakeItYoursDialog({ open, onOpenChange, onChoose }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Make it yours</DialogTitle>
                    <DialogDescription>
                        Saved in this browser only. Nothing leaves it until you share a link.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <button type="button" className={choiceClass} onClick={() => onChoose("copy")}>
                        <span className="block font-medium">Copy this example</span>
                        <span className="text-muted-foreground text-sm">
                            Keep its stories and edit them.
                        </span>
                    </button>
                    <button type="button" className={choiceClass} onClick={() => onChoose("blank")}>
                        <span className="block font-medium">Start blank</span>
                        <span className="text-muted-foreground text-sm">
                            One empty story. Write what someone does today, then mark it.
                        </span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
