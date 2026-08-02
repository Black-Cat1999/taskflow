"use client";

import { Task, TaskStatus } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
    onDeleteTask?: (taskId: string) => void;
}

export function TaskCard({
    task,
    onUpdateStatus,
    onDeleteTask,
}: TaskCardProps) {
    const isOverdue =
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "DONE";

    return (
        <div className="group relative rounded-xl border border-zinc-800/90 bg-zinc-900/80 p-4 shadow-md backdrop-blur-sm hover:border-zinc-700 transition-all space-y-3">
            <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug">
                    {task.title}
                </h4>

                {onDeleteTask && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTask(task.id)}
                        className="h-6 w-6 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-md shrink-0"
                        title="Delete Task"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>

            {task.description && (
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 ${
                            task.priority === "HIGH"
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                : task.priority === "MEDIUM"
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        }`}
                    >
                        {task.priority}
                    </Badge>

                    {task.dueDate && (
                        <span
                            className={`flex items-center gap-1 font-medium ${
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

                {task.assignedTo ? (
                    <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-950/40 px-2 py-0.5 rounded-full border border-zinc-800" title={`Assigned to ${task.assignedTo.name}`}>
                        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-650 text-white font-bold text-[8px] uppercase">
                            {task.assignedTo.name.slice(0, 2)}
                        </div>
                        <span className="max-w-[70px] truncate text-[10px] font-medium text-zinc-300">
                            {task.assignedTo.name}
                        </span>
                    </div>
                ) : (
                    <span className="text-[10px] text-zinc-550 italic font-medium">Unassigned</span>
                )}
            </div>

            {onUpdateStatus && (
                <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2.5 mt-2">
                    {task.status !== "TODO" ? (
                        <button
                            onClick={() =>
                                onUpdateStatus(
                                    task.id,
                                    task.status === "DONE" ? "IN_PROGRESS" : "TODO"
                                )
                            }
                            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-indigo-400 transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            <span>
                                {task.status === "DONE" ? "In Progress" : "To Do"}
                            </span>
                        </button>
                    ) : <div />}

                    {task.status !== "DONE" ? (
                        <button
                            onClick={() =>
                                onUpdateStatus(
                                    task.id,
                                    task.status === "TODO" ? "IN_PROGRESS" : "DONE"
                                )
                            }
                            className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-auto"
                        >
                            <span>
                                {task.status === "TODO" ? "In Progress" : "Mark Done"}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium ml-auto">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
