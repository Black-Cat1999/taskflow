import { NextRequest, NextResponse } from "next/server";

import { updateTaskSchema } from "@/lib/validations";

import { updateTask } from "@/services/task.service";

import { deleteTask } from "@/services/task.service";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const body = await request.json();

    const result =
        updateTaskSchema.safeParse(body);

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

    const { id } = await params;

    const task = await updateTask(
        id,
        result.data
    );

    return NextResponse.json({
        success: true,
        task,
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    await deleteTask(id);

    return NextResponse.json({
        success: true,
        message: "Task Deleted",
    });
}