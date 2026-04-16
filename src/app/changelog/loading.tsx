export default function ChangelogLoading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="bg-muted h-12 w-56 animate-pulse rounded-lg" />
                    <div className="bg-muted h-6 w-80 max-w-full animate-pulse rounded-lg" />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
                <div className="space-y-6">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="relative pl-10">
                            <div className="bg-muted absolute top-1 left-0 h-6 w-6 animate-pulse rounded-full" />
                            <div className="border-border space-y-3 rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                                </div>
                                <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
                                <div className="bg-muted h-4 w-full animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
