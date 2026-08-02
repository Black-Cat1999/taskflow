"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/hooks/useProjects";
import { Loader2, FolderPlus } from "lucide-react";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

export function CreateProjectDialog({
    open,
    onOpenChange,
    onCreated,
}: CreateProjectDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { createProject } = useProjects();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await createProject({
                title: title.trim(),
                description: description.trim() || undefined,
            });
            setTitle("");
            setDescription("");
            onOpenChange(false);
            if (onCreated) onCreated();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-indigo-400">
                        <FolderPlus className="h-5 w-5" />
                        <DialogTitle className="text-lg font-semibold text-white">
                            Create New Project
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-zinc-400">
                        Add a new project to organize your tasks and streamline workflow.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && (
                        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs text-zinc-300">
                            Project Title <span className="text-rose-400">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. Website Redesign"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border-zinc-800 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs text-zinc-300">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the project goals..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="border-zinc-800 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-zinc-400 hover:bg-zinc-900 hover:text-white text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
