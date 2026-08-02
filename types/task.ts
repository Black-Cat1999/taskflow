export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string | null;
    projectId: string;
    assignedToId?: string | null;
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    projectId: string;
    dueDate?: string;
    priority?: Priority;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: string;
}
