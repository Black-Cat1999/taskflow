"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectList } from "@/components/project/ProjectList";
import { useProjects } from "@/hooks/useProjects";
import { Loader2, Plus, RefreshCw, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";

export default function ProjectsPage() {
    const { projects, loading, error, fetchProjects } = useProjects();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
                <Navbar onProjectCreated={fetchProjects} />

                <div className="flex flex-1">
                    <Sidebar />

                    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                    <FolderKanban className="h-6 w-6 text-indigo-400" />
                                    Projects Directory
                                </h1>
                                <p className="text-xs text-zinc-400 mt-1">
                                    View and manage all your workspace projects.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchProjects()}
                                    disabled={loading}
                                    className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                                    <span>Refresh</span>
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={() => setCreateDialogOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs gap-1.5 shadow-md shadow-indigo-600/20"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>New Project</span>
                                </Button>
                            </div>
                        </div>

                        {loading && projects.length === 0 ? (
                            <div className="flex h-64 w-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs text-rose-400">
                                {error}
                            </div>
                        ) : (
                            <ProjectList
                                projects={projects}
                                onNewProject={() => setCreateDialogOpen(true)}
                            />
                        )}
                    </main>
                </div>

                <CreateProjectDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onCreated={fetchProjects}
                />
            </div>
        </ProtectedRoute>
    );
}
