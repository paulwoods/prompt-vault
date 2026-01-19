'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Save, X} from 'lucide-react'

export default function NewPromptPage() {
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const tagList = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '')

        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, content, tags: tagList}),
            })

            if (res.ok) {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Error creating prompt:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Initialize New Asset</h1>
                <button
                    onClick={() => router.back()}
                    className="text-muted-foreground hover:text-white transition-colors"
                >
                    <X className="w-6 h-6"/>
                </button>
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
                        className="block w-full rounded-lg bg-slate-900/50 border border-border text-white shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-3 transition-all placeholder:text-slate-600"
                        placeholder="e.g. SYSTEM_GEN_ALPHA"
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
                        rows={10}
                        className="block w-full rounded-lg bg-slate-900/50 border border-border text-slate-300 shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-4 font-mono leading-relaxed transition-all placeholder:text-slate-600"
                        placeholder="Define system behavior..."
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
                        className="block w-full rounded-lg bg-slate-900/50 border border-border text-white shadow-inner focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm p-3 transition-all placeholder:text-slate-600"
                        placeholder="e.g. production, critical, v1"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-border bg-transparent px-6 py-2.5 text-sm font-bold text-muted-foreground hover:bg-slate-800 hover:text-white transition-all uppercase tracking-wider"
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center rounded-md bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-wider"
                    >
                        <Save className="w-4 h-4 mr-2"/>
                        {loading ? 'EXECUTING...' : 'Commit Asset'}
                    </button>
                </div>
            </form>
        </div>
    )
}
