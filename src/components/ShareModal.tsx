'use client'

import {useEffect, useState} from 'react'
import {Copy, ExternalLink, Plus, Trash2, X} from 'lucide-react'

interface ShareLink {
    id: string
    token: string
    views: number
    createdAt: string
}

export function ShareModal({
                               promptId,
                               isOpen,
                               onClose,
                           }: {
    promptId: string
    isOpen: boolean
    onClose: () => void
}) {
    const [links, setLinks] = useState<ShareLink[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchLinks()
        }
    }, [isOpen, promptId])

    const fetchLinks = async () => {
        try {
            const res = await fetch(`/api/prompts/${promptId}/share`)
            if (res.ok) {
                const data = await res.json()
                setLinks(data)
            }
        } catch (error) {
            console.error('Error fetching share links:', error)
        }
    }

    const createLink = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/prompts/${promptId}/share`, {method: 'POST'})
            if (res.ok) {
                fetchLinks()
            }
        } catch (error) {
            console.error('Error creating share link:', error)
        } finally {
            setLoading(false)
        }
    }

    const revokeLink = async (tokenId: string) => {
        try {
            const res = await fetch(`/api/prompts/${promptId}/share?tokenId=${tokenId}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                setLinks(links.filter((l) => l.id !== tokenId))
            }
        } catch (error) {
            console.error('Error revoking share link:', error)
        }
    }

    const copyToClipboard = (token: string) => {
        const url = `${window.location.origin}/share/${token}`
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-card rounded-xl border border-border shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Access Distribution</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                        <X className="w-6 h-6"/>
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-8">
                        <button
                            onClick={createLink}
                            disabled={loading}
                            className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            {loading ? 'GENERATING...' : 'Generate Access Token'}
                        </button>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {links.length === 0 ? (
                            <p className="text-center text-xs text-muted-foreground font-bold uppercase tracking-widest py-8 bg-slate-900/50 rounded-lg border border-dashed border-border">
                                No Active Distributions
                            </p>
                        ) : (
                            links.map((link) => (
                                <div key={link.id}
                                     className="p-4 border border-border rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span
                                            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                          INIT: {new Date(link.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                          {link.views} READS
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={`${window.location.origin}/share/${link.token}`}
                                            className="flex-grow text-[10px] font-mono p-2 border border-border rounded bg-card text-slate-300 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(link.token)}
                                            className="p-2 text-muted-foreground hover:text-white hover:bg-slate-800 rounded transition-all"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4"/>
                                        </button>
                                        <a
                                            href={`/share/${link.token}`}
                                            target="_blank"
                                            className="p-2 text-muted-foreground hover:text-white hover:bg-slate-800 rounded transition-all"
                                            title="Open"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                        </a>
                                        <button
                                            onClick={() => revokeLink(link.id)}
                                            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-slate-800 rounded transition-all"
                                            title="Revoke"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
