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

    if (currentUser.role !== "MANAGER") {
        return NextResponse.json(
            {
                success: false,
                message: "Access Denied",
            },
            { status: 403 }
        );
    }

    const employees = await prisma.user.findMany({
        where: {
            role: "EMPLOYEE",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return NextResponse.json({
        success: true,
        employees,
    });
}