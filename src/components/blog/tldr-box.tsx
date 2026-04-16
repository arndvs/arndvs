interface TldrBoxProps {
    tldr: string;
}

export function TldrBox({ tldr }: TldrBoxProps) {
    return (
        <aside className="bg-muted/50 border-primary/50 mb-8 rounded-lg border-l-4 px-6 py-4">
            <p className="text-primary mb-1 text-sm font-semibold">TL;DR</p>
            <p className="text-foreground/80 leading-relaxed italic">{tldr}</p>
        </aside>
    );
}
