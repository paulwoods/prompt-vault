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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
                <div className="bg-slate-900 border-b border-border px-6 py-4">
                    <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        PROMPT<span className="text-primary">VAULT</span> PUBLIC_ASSET
                    </h1>
                </div>
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">{prompt.name}</h2>
                        <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                ORIGIN: {prompt.user.name || "UNSPECIFIED"}
                            </span>
                            <span className="text-muted-foreground text-[10px]">•</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                TIMESTAMP: {new Date(prompt.updatedAt).toISOString().split('T')[0]}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-6 mb-8 border border-border shadow-inner">
                        <pre className="whitespace-pre-wrap font-mono text-slate-300 text-sm leading-relaxed">
                          {prompt.content}
                        </pre>
                    </div>

                    {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {prompt.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border border-slate-700"
                                >
                  {tag.name}
                </span>
                            ))}
                        </div>
                    )}

                    <div
                        className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span
                            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                          LOGS: {shareLink.views + 1} ACCESS_EVENTS
                        </span>
                        <a
                            href="/"
                            className="text-xs font-black text-primary hover:text-white uppercase tracking-widest transition-colors"
                        >
                            INITIALIZE PERSONAL VAULT →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
