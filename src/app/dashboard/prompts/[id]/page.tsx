'use client'

import {use, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {History, RotateCcw, Save, Share2, X} from 'lucide-react'

interface Version {
    id: string
    content: string
    createdAt: string
}

interface Tag {
    id: string
    name: string
}

interface Prompt {
    id: string
    name: string
    content: string
    tags: Tag[]
    versions: Version[]
}

export default function PromptDetailsPage({
                                              params,
                                          }: {
    params: Promise<{ id: string }>
}) {
    const {id} = use(params)
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [versions, setVersions] = useState<Version[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchPrompt()
    }, [id])

    const fetchPrompt = async () => {
        try {
            const res = await fetch(`/api/prompts/${id}`)
            if (res.ok) {
                const data: Prompt = await res.json()
                setName(data.name)
                setContent(data.content)
                setTags(data.tags.map((t) => t.name).join(', '))
                setVersions(data.versions)
            }
        } catch (error) {
            console.error('Error fetching prompt:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const tagList = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '')

        try {
            const res = await fetch(`/api/prompts/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, content, tags: tagList}),
            })

            if (res.ok) {
                const updated: Prompt = await res.json()
                setVersions(updated.versions)
                alert('Prompt updated successfully!')
            }
        } catch (error) {
            console.error('Error updating prompt:', error)
        } finally {
            setSaving(false)
        }
    }

    const restoreVersion = (versionContent: string) => {
        if (confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
            setContent(versionContent)
            setShowHistory(false)
        }
    }

    if (loading) return <div className="text-center py-10">Loading...</div>

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Prompt</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2 rounded ${showHistory ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Version History"
                        >
                            <History className="w-5 h-5"/>
                        </button>
                        <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prompt Name
                        </label>
                        <input
                            type="text"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prompt Body
                        </label>
                        <textarea
                            required
                            rows={12}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border font-mono"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2"/>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {showHistory && (
                <div
                    className="w-full lg:w-80 bg-white rounded-lg shadow p-6 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <History className="w-5 h-5 mr-2"/>
                        Version History
                    </h2>
                    <div className="space-y-4">
                        {versions.map((version, index) => (
                            <div key={version.id} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    Version {versions.length - index}
                  </span>
                                    <button
                                        onClick={() => restoreVersion(version.content)}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1"/>
                                        Restore
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    {new Date(version.createdAt).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-2 rounded italic">
                                    &quot;{version.content}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
