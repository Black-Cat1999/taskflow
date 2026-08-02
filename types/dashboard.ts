import { Project } from "./project";

export interface DashboardStats {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
}

export interface DashboardData {
    projects: Project[];
    stats: DashboardStats;
}
