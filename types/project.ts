import { Task } from "./task";

export interface Project {
    id: string;
    title: string;
    description?: string | null;
    ownerId: string;
    tasks?: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectInput {
    title: string;
    description?: string;
}

export interface UpdateProjectInput {
    title?: string;
    description?: string;
}
