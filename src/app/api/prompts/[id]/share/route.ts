import {NextResponse} from "next/server"
import {auth} from "@/auth"
import {prisma} from "@/lib/prisma"

function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(
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
        })

        if (!prompt) {
            return NextResponse.json({message: "Prompt not found"}, {status: 404})
        }

        const shareLink = await prisma.shareLink.create({
            data: {
                promptId: id,
                token: generateToken(),
            },
        })

        return NextResponse.json(shareLink)
    } catch (error) {
        console.error("Failed to create share link:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}

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
        const shareLinks = await prisma.shareLink.findMany({
            where: {promptId: id},
            orderBy: {createdAt: "desc"},
        })

        return NextResponse.json(shareLinks)
    } catch (error) {
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

    const {searchParams} = new URL(req.url)
    const tokenId = searchParams.get("tokenId")

    if (!session?.user?.id || !tokenId) {
        return NextResponse.json({message: "Unauthorized or missing tokenId"}, {status: 401})
    }

    try {
        await prisma.shareLink.delete({
            where: {id: tokenId, promptId: id},
        })

        return NextResponse.json({message: "Share link revoked"})
    } catch (error) {
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}
