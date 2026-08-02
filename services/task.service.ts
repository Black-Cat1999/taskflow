import { prisma } from "@/lib/prisma";

type CreateTaskInput = {
    title: string;
    description?: string;
    projectId: string;
    dueDate?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    assignedToId?: string;
};

export async function createTask(
    data: CreateTaskInput
) {
    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate
                ? new Date(data.dueDate)
                : null,

            priority: data.priority ?? "MEDIUM",

            project: {
                connect: {
                    id: data.projectId,
                },
            },

            assignedTo: data.assignedToId
                ? {
                    connect: {
                        id: data.assignedToId,
                    },
                }
                : undefined,
        },
    });
}

export async function getTasks(projectId: string, userId: string, role: "MANAGER" | "EMPLOYEE") {
    if (role === "MANAGER") {
        return prisma.task.findMany({
            where: {
                projectId,
            },

            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        return prisma.task.findMany({
            where: {
                projectId,
                assignedToId: userId,
            },

            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export async function updateTask(
    taskId: string,
    data: {
        title?: string;
        description?: string;
        status?: "TODO" | "IN_PROGRESS" | "DONE";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        dueDate?: string;
    }
) {
    return prisma.task.update({
        where: {
            id: taskId,
        },

        data: {
            ...data,

            dueDate: data.dueDate
                ? new Date(data.dueDate)
                : undefined,
        },
    });
}

export async function deleteTask(
    taskId: string
) {
    return prisma.task.delete({
        where: {
            id: taskId,
        },
    });
}