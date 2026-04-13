import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-6xl font-bold tracking-tight">404</h1>
            <p className="text-muted-foreground mt-4 text-lg">This page doesn&apos;t exist.</p>
            <Link
                href="/"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center rounded-md px-6 py-3 text-sm font-medium transition-colors"
            >
                Back to home
            </Link>
        </main>
    );
}
