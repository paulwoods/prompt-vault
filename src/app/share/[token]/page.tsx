import {prisma} from "@/lib/prisma"
import {notFound} from "next/navigation"

export default async function PublicSharePage({
                                                  params,
                                              }: {
    params: Promise<{ token: string }>
}) {
    const {token} = await params

    const shareLink = await prisma.shareLink.findUnique({
        where: {token, active: true},
        include: {
            prompt: {
                include: {
                    user: {
                        select: {name: true},
                    },
                    tags: true,
                },
            },
        },
    })

    if (!shareLink) {
        notFound()
    }

    // Track view
    await prisma.shareLink.update({
        where: {id: shareLink.id},
        data: {views: {increment: 1}},
    })

    const {prompt} = shareLink

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white">PromptVault Public Share</h1>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{prompt.name}</h2>
                        <p className="text-sm text-gray-500">
                            Shared by {prompt.user.name || "a User"} • {new Date(prompt.updatedAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-md p-4 mb-6 border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {prompt.content}
            </pre>
                    </div>

                    {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {prompt.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                                >
                  {tag.name}
                </span>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {shareLink.views + 1} views
            </span>
                        <a
                            href="/"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Create your own Vault at PromptVault →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
