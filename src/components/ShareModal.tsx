'use client'

import {useState, useEffect} from 'react'
import {X, Copy, Trash2, ExternalLink, Plus} from 'lucide-react'

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Share Prompt</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6"/>
                    </button>
                </div>
                <div className="p-4">
                    <div className="mb-6">
                        <button
                            onClick={createLink}
                            disabled={loading}
                            className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            {loading ? 'Generating...' : 'Generate New Share Link'}
                        </button>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto">
                        {links.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No active share links.</p>
                        ) : (
                            links.map((link) => (
                                <div key={link.id} className="p-3 border rounded-md bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                                        <span className="text-xs font-medium text-indigo-600">
                      {link.views} views
                    </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={`${window.location.origin}/share/${link.token}`}
                                            className="flex-grow text-xs p-1 border rounded bg-white"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(link.token)}
                                            className="p-1 text-gray-500 hover:text-indigo-600"
                                            title="Copy"
                                        >
                                            <Copy className="w-4 h-4"/>
                                        </button>
                                        <a
                                            href={`/share/${link.token}`}
                                            target="_blank"
                                            className="p-1 text-gray-500 hover:text-indigo-600"
                                            title="Open"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                        </a>
                                        <button
                                            onClick={() => revokeLink(link.id)}
                                            className="p-1 text-gray-500 hover:text-red-600"
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
