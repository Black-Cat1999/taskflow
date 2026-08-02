import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const protectedRoutes = ["/dashboard"];

    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        verifyToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};