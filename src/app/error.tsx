"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
            <p className="text-muted-foreground mt-4 text-lg">An unexpected error occurred.</p>
            {process.env.NODE_ENV === "development" && (
                <pre className="bg-muted mt-4 max-w-lg overflow-auto rounded-md p-4 text-left text-sm">
                    {error.message}
                </pre>
            )}
            <button
                onClick={reset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center rounded-md px-6 py-3 text-sm font-medium transition-colors"
            >
                Try again
            </button>
        </main>
    );
}
