'use client'

import {signOut, useSession} from "next-auth/react"
import Link from "next/link"
import {LogOut, Plus, LayoutDashboard, Settings} from "lucide-react"

export function Navbar() {
    const {data: session} = useSession()

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link href="/dashboard" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-indigo-600">
                PromptVault
              </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
              <span className="mr-4 text-sm text-gray-700 hidden sm:block">
                {session?.user?.name || session?.user?.email}
              </span>
                            <button
                                onClick={() => signOut({callbackUrl: '/'})}
                                className="text-gray-500 hover:text-indigo-600 transition-colors"
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
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link
                            href="/dashboard"
                            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                            <LayoutDashboard
                                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-indigo-600"/>
                            <span className="ml-3">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/prompts/new"
                            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                            <Plus className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-indigo-600"/>
                            <span className="ml-3">New Prompt</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                            <Settings
                                className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-indigo-600"/>
                            <span className="ml-3">Settings & Export</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
