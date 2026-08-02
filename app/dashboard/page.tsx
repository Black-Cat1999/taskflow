"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProjectList } from "@/components/project/ProjectList";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { TeamTasksTable } from "@/components/dashboard/TeamTasksTable";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Plus, RefreshCw, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

import { Project } from "@/types/project";
import { Task } from "@/types/task";

export default function DashboardPage() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useDashboard();
    const [createProjectOpen, setCreateProjectOpen] = useState(false);

    // Extract recent tasks from projects
    const allTasks =
        data?.projects.flatMap((p: Project) =>
            (p.tasks || []).map((t: Task) => ({ ...t, projectId: p.id }))
        ) || [];
    const recentTasks = allTasks.slice(0, 5);

    // Extract all team tasks for manager table view
    const teamTasks =
        data?.projects.flatMap((p: Project) =>
            (p.tasks || []).map((t: Task) => ({
                ...t,
                projectTitle: p.title,
                projectId: p.id,
            }))
        ) || [];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
                <Navbar onProjectCreated={refetch} />

                <div className="flex flex-1">
                    <Sidebar />

                    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    {user?.role === "MANAGER" ? "Manager Workspace Overview" : "Workspace Overview"}
                                </h1>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {user?.role === "MANAGER"
                                        ? "Monitor active projects, allocate resources, and track team progress."
                                        : "Track project metrics, team progress, and upcoming tasks."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={loading}
                                    className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                                    <span>Refresh</span>
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={() => setCreateProjectOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs gap-1.5 shadow-md shadow-indigo-600/20"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Create Project</span>
                                </Button>
                            </div>
                        </div>

                        {loading && !data ? (
                            <div className="flex h-64 w-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs text-rose-400">
                                {error}
                            </div>
                        ) : data ? (
                            <>
                                <DashboardStats stats={data.stats} />

                                {user?.role === "MANAGER" ? (
                                    <div className="space-y-8 pt-2">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <FolderKanban className="h-5 w-5 text-indigo-400" />
                                                    Active Projects
                                                </h2>
                                                <span className="text-xs text-zinc-400 font-medium">
                                                    {data.projects.length} {data.projects.length === 1 ? "project" : "projects"}
                                                </span>
                                            </div>

                                            <ProjectList
                                                projects={data.projects}
                                                onNewProject={() => setCreateProjectOpen(true)}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <TeamTasksTable tasks={teamTasks} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <FolderKanban className="h-5 w-5 text-indigo-400" />
                                                    Active Projects
                                                </h2>
                                                <span className="text-xs text-zinc-400 font-medium">
                                                    {data.projects.length} {data.projects.length === 1 ? "project" : "projects"}
                                                </span>
                                            </div>

                                            <ProjectList
                                                projects={data.projects}
                                                onNewProject={() => setCreateProjectOpen(true)}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-semibold text-white">
                                                    Recent Tasks
                                                </h2>
                                                <span className="text-xs text-zinc-400 font-medium">
                                                    Last 5 items
                                                </span>
                                            </div>

                                            <RecentTasks tasks={recentTasks} />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </main>
                </div>

                <CreateProjectDialog
                    open={createProjectOpen}
                    onOpenChange={setCreateProjectOpen}
                    onCreated={refetch}
                />
            </div>
        </ProtectedRoute>
    );
}