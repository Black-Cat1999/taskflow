"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardData } from "@/types/dashboard";
import { dashboardApi } from "@/services/api";

export function useDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await dashboardApi.getDashboard();
            if (res.success && res.dashboard) {
                setData(res.dashboard);
            } else {
                setError(res.message || "Failed to load dashboard");
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboard,
    };
}

function getErrorMessage(err: unknown): string {
    if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message === "string"
    ) {
        return (err as { response: { data: { message: string } } }).response.data.message;
    }
    return "Failed to fetch dashboard data";
}
