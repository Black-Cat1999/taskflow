import { NextRequest, NextResponse } from "next/server";

import { createTaskSchema } from "@/lib/validations";

import { createTask } from "@/services/task.service";

import { getTasks } from "@/services/task.service";

import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result =
            createTaskSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (result.data.assignedToId && currentUser.role !== "MANAGER") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only managers can assign tasks",
                },
                { status: 403 }
            );
        }
        const task = await createTask(result.data);

        return NextResponse.json(
            {
                success: true,
                task,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: NextRequest) {
    const projectId =
        request.nextUrl.searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json(
            {
                success: false,
                message: "Project ID required",
            },
            { status: 400 }
        );
    }

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

    const tasks = await getTasks(projectId, currentUser.userId, currentUser.role);

    return NextResponse.json({
        success: true,
        tasks,
    });
}