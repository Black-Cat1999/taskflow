"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    CheckSquare,
    Loader2,
    Mail,
    Lock,
    User,
    AlertCircle,
    Eye,
    EyeOff,
} from "lucide-react";

const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError(null);
        try {
            const res = await authApi.register(data);
            if (res.success && res.user) {
                router.push("/dashboard");
            } else {
                setServerError(
                    res.message || "Registration failed. Please try again."
                );
            }
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as { response?: { data?: { message?: string } } })
                    .response?.data?.message === "string"
            ) {
                setServerError(
                    (err as { response: { data: { message: string } } })
                        .response.data.message
                );
            } else {
                setServerError(
                    "An unexpected error occurred. Please try again."
                );
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <div className="relative w-full max-w-md space-y-8">
                {/* Logo & Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <Link href="/" className="group">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/25 transition-shadow group-hover:shadow-indigo-500/40">
                            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
                                <CheckSquare className="h-7 w-7 text-indigo-400" />
                            </div>
                        </div>
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            Create your account
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Get started with TaskFlow for free
                        </p>
                    </div>
                </div>

                {/* Register Card */}
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
                    {/* Server error banner */}
                    {serverError && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
                            <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-rose-300 leading-relaxed">
                                {serverError}
                            </p>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-xs font-medium text-zinc-300"
                            >
                                Full name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    aria-invalid={!!errors.name}
                                    className="h-10 pl-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-xs font-medium text-zinc-300"
                            >
                                Email address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    aria-invalid={!!errors.email}
                                    className="h-10 pl-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-xs font-medium text-zinc-300"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    aria-invalid={!!errors.password}
                                    className="h-10 pl-10 pr-10 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
