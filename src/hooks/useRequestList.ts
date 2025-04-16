import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Request } from "@/types/request";

export function useRequestList(line: string, refetchSignal?: unknown) {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
    const [requests, setRequests] = useState<Request[]>([]);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await fetch(`${baseUrl}/kiosk/sewing?line=${line}`);
            const data = await res.json();
            setRequests(data.data);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to fetch requests");
        }
    }, [baseUrl, line]);

    useEffect(() => {
        fetchRequests();

        const interval = setInterval(fetchRequests, 5000); // polling
        return () => clearInterval(interval);
    }, [fetchRequests, refetchSignal]);

    return { requests, fetchRequests };
}
