'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {ArrowUpDown, Edit3, Search, Share2, Trash2} from 'lucide-react'
import {ShareModal} from '@/components/ShareModal'

interface Tag {
    id: string
    name: string
}

interface Prompt {
    id: string
    name: string
    content: string
    tags: Tag[]
    updatedAt: string
}

export default function DashboardPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('updatedAt')
    const [order, setOrder] = useState('desc')
    const [sharePromptId, setSharePromptId] = useState<string | null>(null)

    useEffect(() => {
        fetchPrompts()
    }, [search, sortBy, order])

    const fetchPrompts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                search,
                sort: sortBy,
                order,
            })
            const res = await fetch(`/api/prompts?${params}`)
            if (res.ok) {
                const data = await res.json()
                setPrompts(data)
            }
        } catch (error) {
            console.error('Error fetching prompts:', error)
        } finally {
            setLoading(false)
        }
    }

    const deletePrompt = async (id: string) => {
        if (!confirm('Are you sure you want to delete this prompt?')) return

        try {
            const res = await fetch(`/api/prompts/${id}`, {method: 'DELETE'})
            if (res.ok) {
                setPrompts(prompts.filter((p) => p.id !== id))
            }
        } catch (error) {
            console.error('Error deleting prompt:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">System Prompts</h1>
                <Link
                    href="/dashboard/prompts/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/10"
                >
                    + NEW PROMPT
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground"/>
                    </div>
                    <input
                        type="text"
                        className="block w-full p-2.5 pl-10 text-sm text-foreground border border-border rounded-lg bg-card focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                        placeholder="Search assets by name, content or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-card border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="updatedAt">Date Modified</option>
                        <option value="name">Name</option>
                    </select>
                    <button
                        className="p-2.5 bg-card border border-border rounded-lg hover:bg-slate-700 text-muted-foreground transition-colors"
                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    >
                        <ArrowUpDown className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Initializing environment...</div>
            ) : prompts.length === 0 ? (
                <div
                    className="text-center py-20 bg-card border border-dashed border-border rounded-lg text-muted-foreground">
                    No records found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map((prompt) => (
                        <div
                            key={prompt.id}
                            className="bg-card border border-border rounded-xl shadow-sm hover:shadow-xl hover:border-slate-500 transition-all p-5 flex flex-col h-full group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-white truncate tracking-tight">
                                    {prompt.name}
                                </h3>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow font-medium leading-relaxed">
                                {prompt.content}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {prompt.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-slate-600"
                                    >
                    {tag.name}
                  </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {new Date(prompt.updatedAt).toLocaleDateString()}
                </span>
                                <div className="flex space-x-1">
                                    <Link
                                        href={`/dashboard/prompts/${prompt.id}`}
                                        className="p-2 text-muted-foreground hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4"/>
                                    </Link>
                                    <button
                                        onClick={() => setSharePromptId(prompt.id)}
                                        className="p-2 text-muted-foreground hover:text-green-400 hover:bg-slate-700 rounded-md transition-colors"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4"/>
                                    </button>
                                    <button
                                        onClick={() => deletePrompt(prompt.id)}
                                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {sharePromptId && (
                <ShareModal
                    promptId={sharePromptId}
                    isOpen={!!sharePromptId}
                    onClose={() => setSharePromptId(null)}
                />
            )}
        </div>
    )
}
