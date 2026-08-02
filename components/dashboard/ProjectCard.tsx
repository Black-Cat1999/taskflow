"use client";

import Link from "next/link";
import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const tasks = project.tasks || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Card className="group relative border-zinc-800 bg-zinc-900/60 p-5 shadow-lg backdrop-blur-sm hover:border-indigo-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <FolderKanban className="h-4 w-4" />
                        </div>
                        <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {project.title}
                        </h4>
                    </div>
                    <Badge variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-300 text-[11px]">
                        {total} {total === 1 ? "task" : "tasks"}
                    </Badge>
                </div>

                <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed min-h-[2rem]">
                    {project.description || "No description provided for this project."}
                </p>

                <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                        <span>Progress ({completed}/{total} {total === 1 ? "task" : "tasks"} completed)</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {completed}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        {total - completed}
                    </span>
                </div>

                <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                    <span>View Board</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </Card>
    );
}
