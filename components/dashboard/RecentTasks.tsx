"use client";

import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Circle, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface RecentTasksProps {
    tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500 text-xs">
                No recent tasks found in your projects.
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {tasks.map((task) => {
                const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "DONE";

                return (
                    <div
                        key={task.id}
                        className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {task.status === "DONE" && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                            )}
                            {task.status === "IN_PROGRESS" && (
                                <Clock className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
                            )}
                            {task.status === "TODO" && (
                                <Circle className="h-4 w-4 shrink-0 text-zinc-500" />
                            )}

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-200 truncate">
                                    {task.title}
                                </p>
                                {task.dueDate && (
                                    <span
                                        className={`flex items-center gap-1 text-[11px] mt-0.5 ${
                                            isOverdue ? "text-rose-400 font-semibold" : "text-zinc-500"
                                        }`}
                                    >
                                        {isOverdue ? (
                                            <AlertTriangle className="h-3 w-3" />
                                        ) : (
                                            <Calendar className="h-3 w-3" />
                                        )}
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Badge
                                variant="outline"
                                className={`text-[10px] uppercase font-semibold ${
                                    task.priority === "HIGH"
                                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                        : task.priority === "MEDIUM"
                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                        : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                }`}
                            >
                                {task.priority}
                            </Badge>

                            <Link
                                href={`/projects/${task.projectId}`}
                                className="text-[11px] text-indigo-400 hover:underline"
                            >
                                Open
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
