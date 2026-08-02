import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const payload = await getCurrentUser();

    if (!payload) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: "User not found",
            },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        user,
    });
}