import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    iconColor?: string;
    bgColor?: string;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    iconColor = "text-indigo-400",
    bgColor = "bg-indigo-500/10 border-indigo-500/20",
}: StatsCardProps) {
    return (
        <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900/60 p-5 shadow-lg backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        {value}
                    </h3>
                    {description && (
                        <p className="mt-1 text-xs text-zinc-400">{description}</p>
                    )}
                </div>
                <div
                    className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl border p-2.5 shadow-inner",
                        bgColor
                    )}
                >
                    <Icon className={cn("h-5 w-5", iconColor)} />
                </div>
            </div>
        </Card>
    );
}
