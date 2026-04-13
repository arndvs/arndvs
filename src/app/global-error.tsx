"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    fontFamily: "system-ui, sans-serif",
                    background: "#0a0a0a",
                    color: "#fafafa",
                }}
            >
                <main
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        textAlign: "center",
                    }}
                >
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Something went wrong</h1>
                    <p style={{ marginTop: "1rem", color: "#a1a1a1" }}>
                        A critical error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            marginTop: "2rem",
                            padding: "0.75rem 1.5rem",
                            background: "#fafafa",
                            color: "#0a0a0a",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                        }}
                    >
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}
