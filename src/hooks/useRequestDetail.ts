import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    ProductionData,
    RequestData,
    ProcessLayout,
    OrderProcess,
} from "@/types/request";
import { ManPower, OrderInfo } from "@/types/order";
import { kiosk } from "@/lib/axios";

type SOP = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string | null;
};

export type RequestDetail = {
    request_info: RequestData;
    image_preview: string;
    order_info: OrderInfo;
    man_power: ManPower;
    defect_summary: Record<string, number>;
    process_summary: {
        total_defect: number;
        processes: {
            name: string;
            defect_count: number;
        }[];
    };
    production_data: ProductionData;
    process_layout?: ProcessLayout[];
    order_process?: OrderProcess[];
    sop_data?: SOP[];
};

export const useRequestDetail = (line: string) => {
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
        null
    );
    const [selectedRequest, setSelectedRequest] =
        useState<RequestDetail | null>(null);
    const [processes, setProcesses] = useState<OrderProcess[]>([]);

    const fetchRequestDetail = useCallback(
        async (reqId: number) => {
            try {
                const res = await kiosk.get(`/sewing/${reqId}?line=${line}`);
                const result = res.data;

                if (result.status === "error") {
                    toast.warning(result.errors);
                    setSelectedRequest(null);
                    return false;
                }

                // const detail = result.data;
                result.defect_summary ??= {};
                result.process_summary ??= {};
                setSelectedRequest(result);
                setProcesses(result.order_process);
                return true;
            } catch (err: unknown) {
                console.error("Request failed:", err);
                setSelectedRequest(null);
                return false;
            }
        },
        [line]
    );

    const selectRequest = (reqId: number) => {
        setSelectedRequestId(reqId);
        fetchRequestDetail(reqId);
    };

    useEffect(() => {
        if (!selectedRequestId) return;

        let isActive = true;
        const interval = setInterval(async () => {
            const ok = await fetchRequestDetail(selectedRequestId);
            if (!ok && isActive) {
                clearInterval(interval);
            }
        }, 3000);

        return () => {
            isActive = false;
            clearInterval(interval);
        };
    }, [selectedRequestId, fetchRequestDetail]);

    return {
        selectedRequestId,
        selectedRequest,
        selectRequest,
        processes,
    };
};
