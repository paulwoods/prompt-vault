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
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Prompt</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-6 h-6"/>
                </button>
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
                        placeholder="e.g. Email Subject Generator"
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
                        rows={10}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="Write your prompt here..."
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
                        placeholder="e.g. marketing, writing, ai"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2"/>
                        {loading ? 'Saving...' : 'Save Prompt'}
                    </button>
                </div>
            </form>
        </div>
    )
}
