import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";

import { getDashboard } from "@/services/dashboard.service";

export async function GET() {

    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    const dashboard = await getDashboard(
        user.userId,
        user.role
    );

    return NextResponse.json({
        success: true,
        dashboard,
    });
}