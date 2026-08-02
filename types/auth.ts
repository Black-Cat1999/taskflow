export interface User {
    id: string;
    name: string;
    email: string;
    role?: "MANAGER" | "EMPLOYEE";
    createdAt?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
    errors?: Record<string, string[]>;
}
