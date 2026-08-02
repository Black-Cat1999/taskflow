"use client";

import { useState, useEffect, useCallback } from "react";
import { Project, CreateProjectInput, UpdateProjectInput } from "@/types/project";
import { projectApi } from "@/services/api";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await projectApi.getProjects();
            if (res.success && res.projects) {
                setProjects(res.projects);
            } else {
                setError(res.message || "Failed to fetch projects");
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (data: CreateProjectInput) => {
        setError(null);
        try {
            const res = await projectApi.createProject(data);
            if (res.success && res.project) {
                setProjects((prev) => [res.project, ...prev]);
                return res.project;
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const updateProject = async (id: string, data: UpdateProjectInput) => {
        setError(null);
        try {
            const res = await projectApi.updateProject(id, data);
            if (res.success) {
                await fetchProjects();
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const deleteProject = async (id: string) => {
        setError(null);
        try {
            const res = await projectApi.deleteProject(id);
            if (res.success) {
                setProjects((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
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
    return "An error occurred with projects";
}
