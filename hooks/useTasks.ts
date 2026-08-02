"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";
import { taskApi } from "@/services/api";

export function useTasks(projectId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(!!projectId);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await taskApi.getTasks(projectId);
            if (res.success && res.tasks) {
                setTasks(res.tasks);
            } else {
                setError(res.message || "Failed to fetch tasks");
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId, fetchTasks]);

    const createTask = async (data: CreateTaskInput) => {
        setError(null);
        try {
            const res = await taskApi.createTask(data);
            if (res.success && res.task) {
                setTasks((prev) => [res.task, ...prev]);
                return res.task;
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            throw err;
        }
    };

    const updateTask = async (id: string, data: UpdateTaskInput) => {
        setError(null);
        try {
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, ...data } : t))
            );
            const res = await taskApi.updateTask(id, data);
            if (!res.success) {
                await fetchTasks();
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            await fetchTasks();
            throw err;
        }
    };

    const deleteTask = async (id: string) => {
        setError(null);
        try {
            setTasks((prev) => prev.filter((t) => t.id !== id));
            const res = await taskApi.deleteTask(id);
            if (!res.success) {
                await fetchTasks();
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
            await fetchTasks();
            throw err;
        }
    };

    return {
        tasks,
        setTasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
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
    return "An error occurred with tasks";
}
