import {NextResponse} from "next/server"
import {auth} from "@/auth"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || ""
    const sort = searchParams.get("sort") || "updatedAt"
    const order = searchParams.get("order") || "desc"

    try {
        const prompts = await prisma.prompt.findMany({
            where: {
                userId: session.user.id,
                AND: [
                    search
                        ? {
                            OR: [
                                {name: {contains: search}},
                                {content: {contains: search}},
                                {tags: {some: {name: {contains: search}}}},
                            ],
                        }
                        : {},
                    tag ? {tags: {some: {name: tag}}} : {},
                ],
            },
            include: {
                tags: true,
            },
            orderBy: {
                [sort]: order,
            },
        })

        return NextResponse.json(prompts)
    } catch (error) {
        console.error("Failed to fetch prompts:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    try {
        const {name, content, tags} = await req.json()

        if (!name || !content) {
            return NextResponse.json(
                {message: "Name and content are required"},
                {status: 400}
            )
        }

        const prompt = await prisma.prompt.create({
            data: {
                name,
                content,
                userId: session.user.id,
                tags: {
                    connectOrCreate: (tags || []).map((tagName: string) => ({
                        where: {name: tagName},
                        create: {name: tagName},
                    })),
                },
                versions: {
                    create: {
                        content,
                    },
                },
            },
            include: {
                tags: true,
            },
        })

        return NextResponse.json(prompt, {status: 201})
    } catch (error) {
        console.error("Failed to create prompt:", error)
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        )
    }
}
