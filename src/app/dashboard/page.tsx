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
                <h1 className="text-2xl font-bold text-gray-900">Your Prompts</h1>
                <Link
                    href="/dashboard/prompts/new"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                    New Prompt
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-gray-500"/>
                    </div>
                    <input
                        type="text"
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search prompts by name, content or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="updatedAt">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>
                    <button
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    >
                        <ArrowUpDown className="w-4 h-4 text-gray-500"/>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading prompts...</div>
            ) : prompts.length === 0 ? (
                <div
                    className="text-center py-10 bg-white border border-dashed border-gray-300 rounded-lg text-gray-500">
                    No prompts found. Click "New Prompt" to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map((prompt) => (
                        <div
                            key={prompt.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">
                                    {prompt.name}
                                </h3>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                {prompt.content}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {prompt.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                                    >
                    {tag.name}
                  </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(prompt.updatedAt).toLocaleDateString()}
                </span>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/dashboard/prompts/${prompt.id}`}
                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4"/>
                                    </Link>
                                    <button
                                        onClick={() => setSharePromptId(prompt.id)}
                                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4"/>
                                    </button>
                                    <button
                                        onClick={() => deletePrompt(prompt.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
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
