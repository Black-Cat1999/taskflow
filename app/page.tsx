"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, CheckSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.push("/dashboard");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />

            <main className="relative max-w-3xl text-center space-y-8 py-16">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/30">
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
                        <CheckSquare className="h-8 w-8 text-indigo-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
                        TaskFlow Workspace
                    </h1>
                    <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        Streamline your projects, organize tasks into intuitive Kanban boards, and boost productivity effortlessly.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 px-8 gap-2"
                        >
                            <span>Get Started Free</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl px-8"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
