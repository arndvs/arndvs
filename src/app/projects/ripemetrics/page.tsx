import type { Metadata } from "next"
import RipeMetricsContent from "./ripemetrics-content"

export const metadata: Metadata = {
  title: "RipeMetrics",
  description:
    "Case study: AI-native customer growth platform serving 50+ enterprise clients. Reduced customer service costs by 40% through AI automation with 95%+ uptime.",
}

export default function RipeMetricsPage() {
  return <RipeMetricsContent />
}

