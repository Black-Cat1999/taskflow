import { prisma } from "@/lib/prisma";

export async function getDashboard(userId: string, role: "MANAGER" | "EMPLOYEE") {
    let projects;

    if (role === "MANAGER") {
        projects = await prisma.project.findMany({
            where: {
                ownerId: userId,
            },

            include: {
                tasks: {
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
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        // Employee dashboard: only show projects they have tasks in, and only include their tasks
        projects = await prisma.project.findMany({
            where: {
                tasks: {
                    some: {
                        assignedToId: userId,
                    },
                },
            },

            include: {
                tasks: {
                    where: {
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
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    }

    const totalProjects = projects.length;

    const totalTasks = projects.reduce(
        (sum, project) => sum + project.tasks.length,
        0
    );

    const completedTasks = projects.reduce(
        (sum, project) =>
            sum +
            project.tasks.filter(
                (task) => task.status === "DONE"
            ).length,
        0
    );

    const pendingTasks = projects.reduce(
        (sum, project) =>
            sum +
            project.tasks.filter(
                (task) => task.status !== "DONE"
            ).length,
        0
    );

    const overdueTasks = projects.reduce(
        (sum, project) =>
            sum +
            project.tasks.filter(
                (task) =>
                    task.dueDate &&
                    task.dueDate < new Date() &&
                    task.status !== "DONE"
            ).length,
        0
    );

    return {
        projects,

        stats: {
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
        },
    };
}