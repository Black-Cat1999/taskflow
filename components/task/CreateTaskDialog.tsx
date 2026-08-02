"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Priority } from "@/types/task";
import { Loader2, CheckSquare } from "lucide-react";
import { employeeApi } from "@/services/api";

type Employee = {
    id: string;
    name: string;
    email: string;
};

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    onCreateTask: (data: {
        title: string;
        description?: string;
        projectId: string;
        dueDate?: string;
        priority?: Priority;
        assignedToId?: string;
    }) => Promise<unknown>;
}

export function CreateTaskDialog({
    open,
    onOpenChange,
    projectId,
    onCreateTask,
}: CreateTaskDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [assignedToId, setAssignedToId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const loadEmployees = async () => {
            try {
                const response = await employeeApi.getEmployees();
                setEmployees(response.employees || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadEmployees();
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !projectId) return;

        setLoading(true);
        setError(null);

        try {
            await onCreateTask({
                title: title.trim(),
                description: description.trim() || undefined,
                projectId,
                dueDate: dueDate || undefined,
                priority,
                assignedToId: assignedToId || undefined,
            });

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setDueDate("");
            setAssignedToId("");

            onOpenChange(false);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create task"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-[450px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-indigo-400">
                        <CheckSquare className="h-5 w-5" />
                        <DialogTitle className="text-lg font-semibold text-white">
                            Create New Task
                        </DialogTitle>
                    </div>

                    <DialogDescription className="text-xs text-zinc-400">
                        Add a task to your project and assign it to an employee.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-4"
                >
                    {error && (
                        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label
                            htmlFor="task-title"
                            className="text-xs text-zinc-300"
                        >
                            Task Title{" "}
                            <span className="text-rose-400">*</span>
                        </Label>

                        <Input
                            id="task-title"
                            placeholder="Design Landing Page"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                            className="border-zinc-800 bg-zinc-900 text-sm text-white placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="task-desc"
                            className="text-xs text-zinc-300"
                        >
                            Description
                        </Label>

                        <Textarea
                            id="task-desc"
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="border-zinc-800 bg-zinc-900 text-white resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">
                                Priority
                            </Label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target
                                            .value as Priority
                                    )
                                }
                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">
                                    Medium
                                </option>
                                <option value="HIGH">
                                    High
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">
                                Due Date
                            </Label>

                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }
                                className="border-zinc-800 bg-zinc-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-300">
                            Assign Employee
                        </Label>

                        <select
                            value={assignedToId}
                            onChange={(e) =>
                                setAssignedToId(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                        >
                            <option value="">
                                Unassigned
                            </option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                loading || !title.trim()
                            }
                            className="bg-indigo-600 hover:bg-indigo-500"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Task"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}