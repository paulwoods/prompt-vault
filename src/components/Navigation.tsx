'use client'

import {signOut, useSession} from "next-auth/react"
import Link from "next/link"
import {LayoutDashboard, LogOut, Plus, Settings} from "lucide-react"

export function Navbar() {
    const {data: session} = useSession()

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border bg-card">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link href="/dashboard" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap text-white tracking-tight">
                PROMPT<span className="text-primary">VAULT</span>
              </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
              <span className="mr-4 text-sm text-muted-foreground hidden sm:block">
                {session?.user?.name || session?.user?.email}
              </span>
                            <button
                                onClick={() => signOut({callbackUrl: '/'})}
                                className="text-muted-foreground hover:text-white transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export function Sidebar() {
    return (
        <aside
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-card border-r border-border sm:translate-x-0">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-card">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link
                            href="/dashboard"
                            className="flex items-center p-2 text-slate-300 rounded-lg hover:bg-slate-700/50 group transition-colors"
                        >
                            <LayoutDashboard
                                className="w-5 h-5 text-muted-foreground transition duration-75 group-hover:text-primary"/>
                            <span className="ml-3">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/prompts/new"
                            className="flex items-center p-2 text-slate-300 rounded-lg hover:bg-slate-700/50 group transition-colors"
                        >
                            <Plus
                                className="w-5 h-5 text-muted-foreground transition duration-75 group-hover:text-primary"/>
                            <span className="ml-3">New Prompt</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center p-2 text-slate-300 rounded-lg hover:bg-slate-700/50 group transition-colors"
                        >
                            <Settings
                                className="w-5 h-5 text-muted-foreground transition duration-75 group-hover:text-primary"/>
                            <span className="ml-3">Settings & Export</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
