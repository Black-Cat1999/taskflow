"use client";

import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectHeaderProps {
    project: Project;
    onAddTask: () => void;
    onDeleteProject?: () => void;
}

export function ProjectHeader({
    project,
    onAddTask,
    onDeleteProject,
}: ProjectHeaderProps) {
    const tasks = project.tasks || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;

    return (
        <div className="space-y-4 pb-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Projects</span>
                </Link>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <FolderKanban className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {project.title}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <Badge variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px]">
                                    {completed} of {total} completed
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {project.description && (
                        <p className="text-xs text-zinc-400 max-w-2xl mt-2 pl-13 leading-relaxed">
                            {project.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {onDeleteProject && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDeleteProject}
                            className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs gap-1.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete Project</span>
                        </Button>
                    )}

                    <Button
                        onClick={onAddTask}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Task</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
