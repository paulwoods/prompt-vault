'use client'

import {Download} from 'lucide-react'
import {useSession} from 'next-auth/react'

export default function SettingsPage() {
    const {data: session} = useSession()

    const handleExport = (format: 'json' | 'csv') => {
        window.location.href = `/api/export?format=${format}`
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Settings & Data
                Governance</h1>

            <div className="bg-card rounded-xl border border-border shadow-2xl p-6">
                <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest pb-2 border-b border-border">User
                    Profile</h2>
                <div className="space-y-4">
                    <div>
                        <span
                            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Authenticated Identity</span>
                        <p className="text-sm text-white font-mono">{session?.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <span
                            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Corporate Email Address</span>
                        <p className="text-sm text-white font-mono">{session?.user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-2xl p-6">
                <h2 className="text-sm font-black text-white mb-4 uppercase tracking-widest pb-2 border-b border-border">Data
                    Portability</h2>
                <p className="text-xs text-muted-foreground mb-8 font-medium leading-relaxed max-w-2xl">
                    Execute a complete archival download of your prompt database.
                    All assets, revisions, and metadata will be exported in the selected schema.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => handleExport('json')}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-slate-800 px-6 py-2.5 text-xs font-black text-white hover:bg-slate-700 transition-all uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4 mr-2 text-primary"/>
                        Export Schema (JSON)
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-slate-800 px-6 py-2.5 text-xs font-black text-white hover:bg-slate-700 transition-all uppercase tracking-widest"
                    >
                        <Download className="w-4 h-4 mr-2 text-primary"/>
                        Export Table (CSV)
                    </button>
                </div>
            </div>

            <div className="bg-red-950/20 rounded-xl border border-red-900/50 p-6">
                <h2 className="text-sm font-black text-red-500 mb-2 uppercase tracking-widest">Termination
                    Protocols</h2>
                <p className="text-xs text-red-400/80 mb-6 font-medium leading-relaxed">
                    Initiating account termination will result in the permanent deletion of all vaulted assets and
                    revision history.
                </p>
                <button
                    disabled
                    className="inline-flex items-center justify-center rounded-lg bg-red-900/50 px-6 py-2.5 text-xs font-black text-white disabled:opacity-30 uppercase tracking-widest"
                >
                    Terminate Identity
                </button>
            </div>
        </div>
    )
}
