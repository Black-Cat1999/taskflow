import { prisma } from "@/lib/prisma";

type CreateProjectInput = {
    title: string;
    description?: string;
    ownerId: string;
};

export async function createProject(
    data: CreateProjectInput
) {
    return prisma.project.create({
        data: {
            title: data.title,
            description: data.description,

            owner: {
                connect: {
                    id: data.ownerId,
                },
            },
        },
    });
}

export async function getProjects(userId: string, role: "MANAGER" | "EMPLOYEE") {
    if (role === "MANAGER") {
        return prisma.project.findMany({
            where: {
                ownerId: userId,
            },

            include: {
                tasks: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        return prisma.project.findMany({
            where: {
                tasks: {
                    some: {
                        assignedToId: userId,
                    },
                },
            },

            include: {
                tasks: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export async function getProjectById(
    projectId: string,
    userId: string,
    role: "MANAGER" | "EMPLOYEE"
) {
    if (role === "MANAGER") {
        return prisma.project.findFirst({
            where: {
                id: projectId,
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
        });
    } else {
        return prisma.project.findFirst({
            where: {
                id: projectId,
                tasks: {
                    some: {
                        assignedToId: userId,
                    },
                },
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
        });
    }
}
export async function updateProject(
    projectId: string,
    ownerId: string,
    data: {
        title?: string;
        description?: string;
    }
) {
    return prisma.project.updateMany({
        where: {
            id: projectId,
            ownerId,
        },

        data,
    });
}
export async function deleteProject(
    projectId: string,
    ownerId: string
) {
    return prisma.project.deleteMany({
        where: {
            id: projectId,
            ownerId,
        },
    });
}