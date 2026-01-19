import {NextResponse} from "next/server"
import {auth} from "@/auth"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const format = searchParams.get("format") || "json"

    try {
        const prompts = await prisma.prompt.findMany({
            where: {userId: session.user.id},
            include: {
                tags: true,
            },
        })

        if (format === "csv") {
            const headers = ["id", "name", "content", "tags", "createdAt", "updatedAt"]
            const rows = prompts.map((p) => [
                p.id,
                `"${p.name.replace(/"/g, '""')}"`,
                `"${p.content.replace(/"/g, '""')}"`,
                `"${p.tags.map((t) => t.name).join(", ")}"`,
                p.createdAt.toISOString(),
                p.updatedAt.toISOString(),
            ])

            const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

            return new NextResponse(csvContent, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="prompts-export.csv"`,
                },
            })
        }

        // Default JSON
        return NextResponse.json(prompts, {
            headers: {
                "Content-Disposition": `attachment; filename="prompts-export.json"`,
            },
        })
    } catch (error) {
        console.error("Export failed:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}
