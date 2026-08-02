"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut, User as UserIcon, Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

export function Navbar({ onProjectCreated }: { onProjectCreated?: () => void }) {
    const { user, logout } = useAuth();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                                <CheckSquare className="h-5 w-5 text-indigo-400" />
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                            TaskFlow
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setCreateOpen(true)}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20 gap-1.5 rounded-lg"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Project</span>
                    </Button>

                    <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-700">
                                {user?.name?.slice(0, 2).toUpperCase() || <UserIcon className="h-4 w-4" />}
                            </div>
                            <div className="hidden md:flex flex-col">
                                <span className="text-sm font-medium text-zinc-200 leading-none">
                                    {user?.name}
                                </span>
                                <span className="text-xs text-zinc-400 mt-1 leading-none">
                                    {user?.email}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            title="Sign out"
                            className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <CreateProjectDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={onProjectCreated}
            />
        </>
    );
}
