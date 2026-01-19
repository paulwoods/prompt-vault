import {SessionProvider} from "next-auth/react"
import {Navbar, Sidebar} from "@/components/Navigation"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <div className="min-h-screen bg-gray-50">
                <Navbar/>
                <Sidebar/>
                <div className="p-4 sm:ml-64 pt-20">
                    <main className="max-w-6xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    )
}
