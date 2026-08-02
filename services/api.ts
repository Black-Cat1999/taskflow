import axios from "axios";
import { LoginInput, RegisterInput, AuthResponse } from "@/types/auth";
import { CreateProjectInput, UpdateProjectInput } from "@/types/project";
import { CreateTaskInput, UpdateTaskInput } from "@/types/task";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const authApi = {
    login: async (data: LoginInput): Promise<AuthResponse> => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },
    register: async (data: RegisterInput): Promise<AuthResponse> => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },
    logout: async (): Promise<{ success: boolean }> => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
    getMe: async (): Promise<AuthResponse> => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};

export const dashboardApi = {
    getDashboard: async () => {
        const response = await api.get("/dashboard");
        return response.data;
    },
};

export const projectApi = {
    getProjects: async () => {
        const response = await api.get("/projects");
        return response.data;
    },
    getProjectById: async (id: string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
    createProject: async (data: CreateProjectInput) => {
        const response = await api.post("/projects", data);
        return response.data;
    },
    updateProject: async (id: string, data: UpdateProjectInput) => {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data;
    },
    deleteProject: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};

export const taskApi = {
    getTasks: async (projectId: string) => {
        const response = await api.get(`/tasks?projectId=${projectId}`);
        return response.data;
    },
    createTask: async (data: CreateTaskInput) => {
        const response = await api.post("/tasks", data);
        return response.data;
    },
    updateTask: async (id: string, data: UpdateTaskInput) => {
        const response = await api.patch(`/tasks/${id}`, data);
        return response.data;
    },
    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};

export const employeeApi = {
    getEmployees: async () => {
        const response = await api.get("/employees");
        return response.data;
    },
};

export default api;
