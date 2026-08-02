import { StatsCard } from "./StatsCard";
import { DashboardStats as StatsType } from "@/types/dashboard";
import { FolderKanban, CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

interface DashboardStatsProps {
    stats: StatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={FolderKanban}
                description="Active workspace projects"
                iconColor="text-indigo-400"
                bgColor="bg-indigo-500/10 border-indigo-500/20"
            />
            <StatsCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={ListTodo}
                description="Across all projects"
                iconColor="text-purple-400"
                bgColor="bg-purple-500/10 border-purple-500/20"
            />
            <StatsCard
                title="Completed"
                value={stats.completedTasks}
                icon={CheckCircle2}
                description="Tasks marked done"
                iconColor="text-emerald-400"
                bgColor="bg-emerald-500/10 border-emerald-500/20"
            />
            <StatsCard
                title="Pending"
                value={stats.pendingTasks}
                icon={Clock}
                description="In TODO or IN_PROGRESS"
                iconColor="text-amber-400"
                bgColor="bg-amber-500/10 border-amber-500/20"
            />
            <StatsCard
                title="Overdue"
                value={stats.overdueTasks}
                icon={AlertCircle}
                description="Past due date"
                iconColor="text-rose-400"
                bgColor="bg-rose-500/10 border-rose-500/20"
            />
        </div>
    );
}
