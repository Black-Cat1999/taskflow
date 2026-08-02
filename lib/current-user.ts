import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "@/lib/auth";

export async function getCurrentUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();

    console.log("All Cookies:", cookieStore.getAll());

    const token = cookieStore.get("token")?.value;

    console.log("Token:", token);

    if (!token) {
        return null;
    }

    try {
        const decoded = verifyToken(token);

        console.log("Decoded Token:", decoded);

        return decoded;
    } catch (error) {
        console.error("JWT Verify Error:", error);
        return null;
    }
}