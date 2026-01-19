import {auth} from "@/auth"
import Link from "next/link"
import {redirect} from "next/navigation"

export default async function Home() {
    const session = await auth()

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
            <h1 className="mb-4 text-6xl font-black text-white tracking-tighter">
                PROMPT<span className="text-primary">VAULT</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground font-medium">
                Enterprise-grade prompt management.
                Secure, versioned, and engineered for the modern AI workflow.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                    href="/login"
                    className="rounded-md bg-primary px-8 py-3 font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                >
                    GET STARTED
                </Link>
                <Link
                    href="/register"
                    className="rounded-md border border-border bg-card px-8 py-3 font-bold text-foreground hover:bg-slate-800 transition-all"
                >
                    SIGN UP
                </Link>
            </div>
        </div>
    )
}
