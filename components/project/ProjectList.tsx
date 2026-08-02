"use client";

import { Project } from "@/types/project";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectListProps {
    projects: Project[];
    onNewProject?: () => void;
}

export function ProjectList({ projects, onNewProject }: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 p-12 text-center bg-zinc-950/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
                    <FolderKanban className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">No projects created yet</h3>
                <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                    Get started by creating your first project to organize tasks and manage your workspace effectively.
                </p>
                {onNewProject && (
                    <Button
                        onClick={onNewProject}
                        size="sm"
                        className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4"
                    >
                        Create First Project
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
