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

    if (loading) return <div className="text-center py-20 text-muted-foreground font-mono">LOADING_DATA...</div>

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-grow bg-card rounded-xl border border-border shadow-2xl p-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Edit Asset</h1>
                        <p className="text-xs text-muted-foreground font-mono mt-1">UUID: {id}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2.5 rounded-md transition-all ${showHistory ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'text-muted-foreground hover:bg-slate-700 hover:text-white'}`}
                            title="Version History"
                        >
                            <History className="w-5 h-5"/>
                        </button>
                        <button
                            className="p-2.5 text-muted-foreground hover:bg-slate-700 hover:text-white rounded-md transition-all"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2.5 text-muted-foreground hover:bg-slate-700 hover:text-white rounded-md transition-all"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label
                            className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                            Asset Designation
                        </label>
                        <input
                            type="text"
                            required
                            className="block w-full rounded-lg bg-slate-900/50 border border-border text-white shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-3 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                            Content Payload
                        </label>
                        <textarea
                            required
                            rows={12}
                            className="block w-full rounded-lg bg-slate-900/50 border border-border text-slate-300 shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 font-mono leading-relaxed transition-all"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                            Taxonomy Tags (CSV)
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-lg bg-slate-900/50 border border-border text-white shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-3 transition-all"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-border">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-wider"
                        >
                            <Save className="w-4 h-4 mr-2"/>
                            {saving ? 'SYNCHRONIZING...' : 'Commit Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {showHistory && (
                <div
                    className="w-full lg:w-96 bg-card rounded-xl border border-border shadow-2xl p-6 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
                    <h2 className="text-sm font-black text-white mb-6 flex items-center uppercase tracking-widest pb-2 border-b border-border">
                        <History className="w-4 h-4 mr-2 text-primary"/>
                        Revision Logs
                    </h2>
                    <div className="space-y-6">
                        {versions.map((version, index) => (
                            <div key={version.id} className="border-l-2 border-slate-700 pl-4 pb-2">
                                <div className="flex justify-between items-center mb-2">
                  <span
                      className="text-[10px] font-black text-white uppercase tracking-tighter bg-slate-700 px-2 py-0.5 rounded">
                    REV {versions.length - index}
                  </span>
                                    <button
                                        onClick={() => restoreVersion(version.content)}
                                        className="text-[10px] font-black text-primary hover:text-white flex items-center uppercase tracking-widest transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1"/>
                                        ROLLBACK
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mb-3 font-mono">
                                    {new Date(version.createdAt).toISOString()}
                                </p>
                                <div
                                    className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded border border-border italic line-clamp-4 font-mono leading-relaxed">
                                    &quot;{version.content}&quot;
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
