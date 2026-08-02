import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

type RegisterUserInput = {
    name: string;
    email: string;
    password: string;
};

export async function registerUser(data: RegisterUserInput) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "EMPLOYEE",
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export async function loginUser(
    email: string,
    password: string
) {
    console.log("Login Email:", email);

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    console.log("Found User:", user);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}