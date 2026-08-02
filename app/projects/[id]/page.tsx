"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { TaskBoard } from "@/components/task/TaskBoard";
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog";
import { Project } from "@/types/project";
import { useTasks } from "@/hooks/useTasks";
import { projectApi } from "@/services/api";
import { Loader2 } from "lucide-react";

interface ProjectDetailsPageProps {
    params: Promise<{ id: string }>;
}

import { TaskStatus } from "@/types/task";

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
    const { id } = React.use(params);
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loadingProject, setLoadingProject] = useState<boolean>(true);
    const [projectError, setProjectError] = useState<string | null>(null);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);

    const { tasks, createTask, updateTask, deleteTask } = useTasks(id);

    const fetchProjectDetails = useCallback(async () => {
        setLoadingProject(true);
        setProjectError(null);
        try {
            const res = await projectApi.getProjectById(id);
            if (res.success && res.project) {
                setProject(res.project);
            } else {
                setProjectError(res.message || "Project not found");
            }
        } catch (err: unknown) {
            setProjectError(getErrorMessage(err));
        } finally {
            setLoadingProject(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const handleDeleteProject = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await projectApi.deleteProject(id);
            router.push("/projects");
        } catch (err) {
            console.error("Failed to delete project", err);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
                <Navbar />

                <div className="flex flex-1">
                    <Sidebar />

                    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                        {loadingProject ? (
                            <div className="flex h-64 w-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        ) : projectError || !project ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs text-rose-400">
                                {projectError || "Project could not be loaded"}
                            </div>
                        ) : (
                            <>
                                <ProjectHeader
                                    project={{ ...project, tasks }}
                                    onAddTask={() => setCreateTaskOpen(true)}
                                    onDeleteProject={handleDeleteProject}
                                />

                                <TaskBoard
                                    projectId={id}
                                    tasks={tasks}
                                    onUpdateStatus={(taskId: string, status: TaskStatus) => updateTask(taskId, { status })}
                                    onDeleteTask={(taskId: string) => deleteTask(taskId)}
                                    onCreateTask={createTask}
                                />

                                <CreateTaskDialog
                                    open={createTaskOpen}
                                    onOpenChange={setCreateTaskOpen}
                                    projectId={id}
                                    onCreateTask={createTask}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function getErrorMessage(err: unknown): string {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
    ) {
        return (err as { response: { data: { message: string } } }).response.data.message;
    }
    return "Failed to load project";
}
