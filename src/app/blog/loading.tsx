export default function BlogLoading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="bg-muted h-12 w-48 animate-pulse rounded-lg" />
                    <div className="bg-muted h-6 w-96 max-w-full animate-pulse rounded-lg" />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="border-border space-y-4 rounded-lg border p-4">
                            <div className="bg-muted aspect-video w-full animate-pulse rounded-md" />
                            <div className="flex justify-between">
                                <div className="bg-muted h-3 w-28 animate-pulse rounded" />
                                <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                            </div>
                            <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
                            <div className="space-y-2">
                                <div className="bg-muted h-4 w-full animate-pulse rounded" />
                                <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
