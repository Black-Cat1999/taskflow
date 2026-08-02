"use client";

import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Circle, Clock, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onUpdateStatus: (taskId: string, status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask?: () => void;
}

export function TaskColumn({
    title,
    status,
    tasks,
    onUpdateStatus,
    onDeleteTask,
    onAddTask,
}: TaskColumnProps) {
    const getHeaderIcon = () => {
        switch (status) {
            case "TODO":
                return <Circle className="h-4 w-4 text-zinc-400" />;
            case "IN_PROGRESS":
                return <Clock className="h-4 w-4 text-amber-400" />;
            case "DONE":
                return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
        }
    };

    const getHeaderBadgeColor = () => {
        switch (status) {
            case "TODO":
                return "bg-zinc-800 text-zinc-300 border-zinc-700";
            case "IN_PROGRESS":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "DONE":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        }
    };

    return (
        <div className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-4">
                <div className="flex items-center gap-2">
                    {getHeaderIcon()}
                    <h3 className="font-semibold text-sm text-zinc-200">{title}</h3>
                    <span
                        className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold ${getHeaderBadgeColor()}`}
                    >
                        {tasks.length}
                    </span>
                </div>

                {onAddTask && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onAddTask}
                        className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg"
                        title="Add task to column"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                {tasks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-800/80 p-4 text-center text-xs text-zinc-500">
                        No tasks in {title.toLowerCase()}
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onUpdateStatus={onUpdateStatus}
                            onDeleteTask={onDeleteTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
