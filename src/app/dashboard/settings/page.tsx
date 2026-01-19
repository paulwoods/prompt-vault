'use client'

import {Download} from 'lucide-react'
import {useSession} from 'next-auth/react'

export default function SettingsPage() {
    const {data: session} = useSession()

    const handleExport = (format: 'json' | 'csv') => {
        window.location.href = `/api/export?format=${format}`
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings & Export</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Account Information</h2>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">Name:</span> {session?.user?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">Email:</span> {session?.user?.email}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Export Your Data</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Download all your prompts in either JSON or CSV format. This includes all prompt content, names, and
                    tags.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => handleExport('json')}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export as JSON
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4 mr-2"/>
                        Export as CSV
                    </button>
                </div>
            </div>

            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h2 className="text-lg font-semibold mb-2 text-red-800">Danger Zone</h2>
                <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    disabled
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                >
                    Delete Account
                </button>
            </div>
        </div>
    )
}
