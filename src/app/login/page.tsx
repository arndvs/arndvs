import { LoginForm } from "./login-form";

export const metadata = {
    title: "Login — arndvs",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Ops Console</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Sign in to manage your content drafts.
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
