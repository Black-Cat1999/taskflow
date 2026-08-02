"use client";

import { useState } from "react";
import { Task, TaskStatus, Priority } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { 
    CheckCircle2, 
    Clock, 
    Circle, 
    Calendar, 
    AlertTriangle, 
    Search, 
    User, 
    FolderKanban,
    ArrowRight,
    SlidersHorizontal,
    ListTodo
} from "lucide-react";
import Link from "next/link";

interface TeamTaskExtended extends Task {
    projectTitle: string;
    projectId: string;
}

interface TeamTasksTableProps {
    tasks: TeamTaskExtended[];
}

export function TeamTasksTable({ tasks }: TeamTasksTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

    // Filter tasks based on search, status, and priority
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.assignedTo?.name || "unassigned").toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
        const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case "DONE":
                return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
            case "IN_PROGRESS":
                return <Clock className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />;
            case "TODO":
                return <Circle className="h-4 w-4 text-zinc-500 shrink-0" />;
        }
    };

    const getStatusStyle = (status: TaskStatus) => {
        switch (status) {
            case "DONE":
                return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
            case "IN_PROGRESS":
                return "border-amber-500/30 bg-amber-500/10 text-amber-400";
            case "TODO":
                return "border-zinc-800 bg-zinc-900/60 text-zinc-400";
        }
    };

    const getPriorityStyle = (priority: Priority) => {
        switch (priority) {
            case "HIGH":
                return "border-rose-500/30 bg-rose-500/10 text-rose-400";
            case "MEDIUM":
                return "border-amber-500/30 bg-amber-500/10 text-amber-400";
            case "LOW":
                return "border-blue-500/30 bg-blue-500/10 text-blue-400";
        }
    };

    return (
        <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
            {/* Header and Controls */}
            <div className="p-5 border-b border-zinc-800/80 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <ListTodo className="h-4 w-4 text-indigo-400" />
                            Team Tasks
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                            Manage and track task assignments for all team members.
                        </p>
                    </div>
                    <Badge variant="outline" className="border-zinc-800 bg-zinc-950/60 text-zinc-400 text-xs">
                        {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} shown
                    </Badge>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search tasks, employees, or projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-zinc-950/50 border border-zinc-800 px-2 py-1.5 rounded-lg">
                            <SlidersHorizontal className="h-3 w-3 text-zinc-500" />
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Filters</span>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Completed</option>
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="LOW">Low Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="HIGH">High Priority</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
                        <ListTodo className="h-8 w-8 text-zinc-700" />
                        <span>No tasks matching the criteria.</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/40 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80">
                                <th className="py-3 px-5 font-semibold">Task</th>
                                <th className="py-3 px-5 font-semibold">Assigned Employee</th>
                                <th className="py-3 px-5 font-semibold">Project</th>
                                <th className="py-3 px-5 font-semibold">Due Date</th>
                                <th className="py-3 px-5 font-semibold">Priority</th>
                                <th className="py-3 px-5 font-semibold">Status</th>
                                <th className="py-3 px-5 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                            {filteredTasks.map((task) => {
                                const isOverdue =
                                    task.dueDate &&
                                    new Date(task.dueDate) < new Date() &&
                                    task.status !== "DONE";

                                return (
                                    <tr 
                                        key={task.id} 
                                        className="hover:bg-zinc-900/30 transition-colors group text-xs text-zinc-300"
                                    >
                                        {/* Task Title & Desc */}
                                        <td className="py-3.5 px-5 max-w-xs">
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                                                    {task.title}
                                                </p>
                                                {task.description && (
                                                    <p className="text-[10px] text-zinc-500 line-clamp-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Assigned Employee */}
                                        <td className="py-3.5 px-5">
                                            {task.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-semibold text-[10px] border border-zinc-700 uppercase">
                                                        {task.assignedTo.name.slice(0, 2)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-zinc-200">
                                                            {task.assignedTo.name}
                                                        </span>
                                                        <span className="text-[9px] text-zinc-500">
                                                            {task.assignedTo.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-zinc-500 italic">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-dashed border-zinc-800 text-[10px]">
                                                        <User className="h-3 w-3 text-zinc-600" />
                                                    </div>
                                                    <span>Unassigned</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Project Title */}
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <FolderKanban className="h-3.5 w-3.5 text-indigo-400/80" />
                                                <span className="font-medium max-w-[120px] truncate">
                                                    {task.projectTitle}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Due Date */}
                                        <td className="py-3.5 px-5">
                                            {task.dueDate ? (
                                                <span
                                                    className={`inline-flex items-center gap-1 font-medium ${
                                                        isOverdue ? "text-rose-400 font-semibold" : "text-zinc-400"
                                                    }`}
                                                >
                                                    {isOverdue ? (
                                                        <AlertTriangle className="h-3.5 w-3.5 text-rose-450 animate-pulse" />
                                                    ) : (
                                                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                    )}
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                    {isOverdue && <span className="text-[9px] uppercase px-1 py-0.25 bg-rose-500/10 rounded border border-rose-500/20 ml-1">Overdue</span>}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-650 italic text-[11px]">-</span>
                                            )}
                                        </td>

                                        {/* Priority */}
                                        <td className="py-3.5 px-5">
                                            <Badge
                                                variant="outline"
                                                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}
                                            >
                                                {task.priority}
                                            </Badge>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(task.status)}
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusStyle(task.status)}`}
                                                >
                                                    {task.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                        </td>

                                        {/* Action Link */}
                                        <td className="py-3.5 px-5 text-right">
                                            <Link
                                                href={`/projects/${task.projectId}`}
                                                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition-all"
                                            >
                                                <span>Board</span>
                                                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
