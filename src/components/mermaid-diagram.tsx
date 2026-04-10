"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidDiagramProps {
  chart: string
  className?: string
  ariaLabel?: string
}

export function MermaidDiagram({ chart, className, ariaLabel }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState("")

  useEffect(() => {
    let cancelled = false

    async function render() {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)",
        flowchart: { htmlLabels: true, curve: "basis" },
        sequence: { actorMargin: 50, messageFontSize: 13 },
      })

      const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`
      const { svg: rendered } = await mermaid.render(id, chart)
      if (!cancelled) setSvg(rendered)
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart])

  return (
    <div className={className} role="img" aria-label={ariaLabel ?? "Architecture diagram"}>
      {svg ? (
        <div
          ref={ref}
          className="overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-muted-foreground" />
        </div>
      )}
    </div>
  )
}
