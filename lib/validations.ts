import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters"),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const createProjectSchema = z.object({
    title: z
        .string()
        .min(3, "Project title must be at least 3 characters"),

    description: z
        .string()
        .optional(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(3).optional(),

    description: z.string().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().min(3),

    description: z.string().optional(),

    projectId: z.string(),

    dueDate: z.string().optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]).optional(),
    assignedToId: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(3).optional(),

    description: z.string().optional(),

    status: z.enum([
        "TODO",
        "IN_PROGRESS",
        "DONE",
    ]).optional(),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]).optional(),

    dueDate: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;