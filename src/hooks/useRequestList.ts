import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Request } from "@/types/request";
import { kiosk } from "@/lib/axios";

export function useRequestList(line: string, refetchSignal?: unknown) {
    const [requests, setRequests] = useState<Request[]>([]);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await kiosk.get(`/sewing?line=${line}`);
            const data = await res.data;
            setRequests(data);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to fetch requests");
        }
    }, [line]);

    useEffect(() => {
        fetchRequests();

        const interval = setInterval(fetchRequests, 5000); // polling
        return () => clearInterval(interval);
    }, [fetchRequests, refetchSignal]);

    return { requests, fetchRequests };
}
