import { NextRequest, NextResponse } from "next/server";

import { registerSchema } from "@/lib/validations";
import { registerUser } from "@/services/auth.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const user = await registerUser(result.data);

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 409 }
            );
        }

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