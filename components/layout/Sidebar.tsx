"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
            <div className="space-y-6">
                <div>
                    <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Navigation
                    </h2>
                    <nav className="mt-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-zinc-500")} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-4 border-t border-zinc-800/60">
                    <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Workspace Overview
                    </h2>
                    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                                Flow Mode
                            </span>
                            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                                Active
                            </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Organize projects, assign tasks, and track real-time productivity.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 to-zinc-950 p-3 text-center">
                <div className="flex justify-center mb-1">
                    <CheckSquare className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-xs font-medium text-zinc-300">TaskFlow Enterprise</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">v1.0.0 • Connected</p>
            </div>
        </aside>
    );
}
