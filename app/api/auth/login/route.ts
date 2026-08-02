import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { loginUser } from "@/services/auth.service";

const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { token, user } = await loginUser(
            result.data.email,
            result.data.password
        );

        const response = NextResponse.json({
            success: true,
            message: "Login Successful",
            user,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "INVALID_CREDENTIALS"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Email or Password",
                },
                { status: 401 }
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