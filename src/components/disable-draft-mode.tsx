"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";

export function DisableDraftMode() {
    const environment = useDraftModeEnvironment();
    const router = useRouter();

    // Only show the disable button when outside of Presentation Tool
    if (environment === "presentation-iframe" || environment === "presentation-window") return null;

    return (
        <button
            type="button"
            onClick={() =>
                fetch("/api/draft-mode/disable", { method: "GET" }).then(() => router.refresh())
            }
            className="fixed right-4 bottom-4 z-50 rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-lg hover:bg-blue-600"
        >
            Disable Draft Mode
        </button>
    );
}
