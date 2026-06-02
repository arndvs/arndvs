export default function ShippedLoading() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <section className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="bg-muted h-12 w-48 animate-pulse rounded-lg" />
                    <div className="bg-muted h-6 w-96 max-w-full animate-pulse rounded-lg" />
                </div>

                <div className="mt-12 space-y-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="border-border space-y-3 rounded-lg border p-6">
                            <div className="flex items-center justify-between">
                                <div className="bg-muted h-4 w-36 animate-pulse rounded" />
                                <div className="flex gap-3">
                                    <div className="bg-muted h-4 w-12 animate-pulse rounded" />
                                    <div className="bg-muted h-4 w-12 animate-pulse rounded" />
                                </div>
                            </div>
                            <div className="bg-muted h-6 w-2/3 animate-pulse rounded" />
                            <div className="bg-muted h-4 w-full animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
