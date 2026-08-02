"use client";

import { useState } from "react";
import { Task, TaskStatus, Priority } from "@/types/task";
import { TaskColumn } from "./TaskColumn";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface TaskBoardProps {
    projectId: string;
    tasks: Task[];
    onUpdateStatus: (taskId: string, status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onCreateTask: (data: {
        title: string;
        description?: string;
        projectId: string;
        dueDate?: string;
        priority?: Priority;
        assignedToId?: string;
    }) => Promise<unknown>;
}

export function TaskBoard({
    projectId,
    tasks,
    onUpdateStatus,
    onDeleteTask,
    onCreateTask,
}: TaskBoardProps) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const todoTasks = tasks.filter((t) => t.status === "TODO");
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
    const doneTasks = tasks.filter((t) => t.status === "DONE");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <TaskColumn
                    title="To Do"
                    status="TODO"
                    tasks={todoTasks}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteTask={onDeleteTask}
                    onAddTask={() => setCreateDialogOpen(true)}
                />

                <TaskColumn
                    title="In Progress"
                    status="IN_PROGRESS"
                    tasks={inProgressTasks}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteTask={onDeleteTask}
                    onAddTask={() => setCreateDialogOpen(true)}
                />

                <TaskColumn
                    title="Completed"
                    status="DONE"
                    tasks={doneTasks}
                    onUpdateStatus={onUpdateStatus}
                    onDeleteTask={onDeleteTask}
                />
            </div>

            <CreateTaskDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                projectId={projectId}
                onCreateTask={onCreateTask}
            />
        </div>
    );
}
