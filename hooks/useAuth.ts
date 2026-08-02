"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, LoginInput, RegisterInput } from "@/types/auth";
import { authApi } from "@/services/api";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authApi.getMe();
            if (res.success && res.user) {
                setUser(res.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (data: LoginInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.login(data);
            if (res.success && res.user) {
                setUser(res.user);
                router.push("/dashboard");
                return res;
            } else {
                setError(res.message || "Failed to login");
                return res;
            }
        } catch (err: unknown) {
            const message =
                axiosError(err) || "An unexpected error occurred during login";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterInput) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.register(data);
            if (res.success && res.user) {
                setUser(res.user);
                router.push("/dashboard");
                return res;
            } else {
                setError(res.message || "Registration failed");
                return res;
            }
        } catch (err: unknown) {
            const message =
                axiosError(err) || "An error occurred during registration";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authApi.logout();
            setUser(null);
            router.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        refetchUser: fetchUser,
    };
}

function axiosError(err: unknown): string | null {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
    ) {
        return (err as { response: { data: { message: string } } }).response.data.message;
    }
    return null;
}
