import {auth} from "@/auth"
import Link from "next/link"
import {redirect} from "next/navigation"

export default async function Home() {
    const session = await auth()

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <h1 className="mb-4 text-5xl font-extrabold text-indigo-600">PromptVault</h1>
            <p className="mb-8 max-w-lg text-lg text-gray-600">
                The ultimate prompt management system for developers and AI enthusiasts.
                Organize, version, and share your AI prompts with ease.
            </p>
            <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
                >
                    Get Started
                </Link>
                <Link
                    href="/register"
                    className="rounded-md border border-indigo-600 px-6 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    )
}
