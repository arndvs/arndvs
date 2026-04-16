import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";

import TranscribeContent from "./transcribe-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Transcribe",
    description: "Audio transcription tool.",
    path: "/transcribe",
    robots: { index: false, follow: false },
});

export default function TranscribePage() {
    return <TranscribeContent />;
}
