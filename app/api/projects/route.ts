import { NextRequest, NextResponse } from "next/server";

import { createProjectSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/current-user";

import { createProject } from "@/services/project.service";
import { getProjects } from "@/services/project.service";

export async function POST(request: NextRequest) {
    try {
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

        const result = createProjectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const project = await createProject({
            ...result.data,
            ownerId: user.userId,
        });

        return NextResponse.json(
            {
                success: true,
                project,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
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

    const projects = await getProjects(
        user.userId,
        user.role
    );

    return NextResponse.json({
        success: true,
        projects,
    });

}