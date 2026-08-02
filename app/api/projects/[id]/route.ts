import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";

import {
    getProjectById,
    updateProject,
    deleteProject,
} from "@/services/project.service";
import { updateProjectSchema } from "@/lib/validations";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const project = await getProjectById(
        id,
        user.userId,
        user.role
    );

    if (!project) {
        return NextResponse.json(
            {
                success: false,
                message: "Project not found",
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json({
        success: true,
        project,
    });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }

    const body = await request.json();

    const result =
        updateProjectSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                success: false,
                errors: result.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
    }

    const { id } = await params;

    await updateProject(
        id,
        user.userId,
        result.data
    );

    return NextResponse.json({
        success: true,
        message: "Project Updated",
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }

    const { id } = await params;

    await deleteProject(
        id,
        user.userId
    );

    return NextResponse.json({
        success: true,
        message: "Project Deleted",
    });
}