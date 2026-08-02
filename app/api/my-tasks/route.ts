import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }
    if (currentUser.role === "MANAGER") {
        const tasks = await prisma.task.findMany({
            include: {
                project: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            tasks,
        });
    }

    const tasks = await prisma.task.findMany({
        where: {
            assignedToId: currentUser.userId,
        },
        include: {
            project: true,
        },
    });

    return NextResponse.json({
        success: true,
        tasks,
    });
}