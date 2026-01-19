import {NextResponse} from "next/server"
import {auth} from "@/auth"
import {prisma} from "@/lib/prisma"

export async function GET(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    const id = (await params).id

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    try {
        const prompt = await prisma.prompt.findUnique({
            where: {id, userId: session.user.id},
            include: {
                tags: true,
                versions: {
                    orderBy: {createdAt: "desc"},
                },
            },
        })

        if (!prompt) {
            return NextResponse.json({message: "Prompt not found"}, {status: 404})
        }

        return NextResponse.json(prompt)
    } catch (error) {
        console.error("Failed to fetch prompt:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}

export async function PATCH(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    const id = (await params).id

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    try {
        const {name, content, tags} = await req.json()

        const currentPrompt = await prisma.prompt.findUnique({
            where: {id, userId: session.user.id},
        })

        if (!currentPrompt) {
            return NextResponse.json({message: "Prompt not found"}, {status: 404})
        }

        const data: any = {}
        if (name) data.name = name
        if (content) {
            data.content = content
            // Create new version if content changed
            if (content !== currentPrompt.content) {
                data.versions = {
                    create: {content},
                }
            }
        }

        if (tags) {
            data.tags = {
                set: [], // Clear current tags
                connectOrCreate: tags.map((tagName: string) => ({
                    where: {name: tagName},
                    create: {name: tagName},
                })),
            }
        }

        const updatedPrompt = await prisma.prompt.update({
            where: {id},
            data,
            include: {
                tags: true,
                versions: {
                    orderBy: {createdAt: "desc"},
                },
            },
        })

        return NextResponse.json(updatedPrompt)
    } catch (error) {
        console.error("Failed to update prompt:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}

export async function DELETE(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    const id = (await params).id

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    try {
        await prisma.prompt.delete({
            where: {id, userId: session.user.id},
        })

        return NextResponse.json({message: "Prompt deleted successfully"})
    } catch (error) {
        console.error("Failed to delete prompt:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}
