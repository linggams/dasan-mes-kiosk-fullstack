import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    ProductionData,
    RequestData,
    ProcessLayout,
    OrderProcess,
} from "@/types/request";
import { ManPower, OrderInfo } from "@/types/order";

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
};

export const useRequestDetail = (baseUrl: string, line: string) => {
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
        null
    );
    const [selectedRequest, setSelectedRequest] =
        useState<RequestDetail | null>(null);
    const [processes, setProcesses] = useState<OrderProcess[]>([]);

    const fetchRequestDetail = useCallback(
        async (reqId: number) => {
            try {
                const res = await fetch(
                    `${baseUrl}/kiosk/sewing/${reqId}?line=${line}`
                );
                const result = await res.json();

                if (result.status === "error") {
                    toast.warning(result.errors);
                    setSelectedRequest(null);
                    return;
                }

                const detail = result.data;
                detail.defect_summary ??= {};
                detail.process_summary ??= {};
                setSelectedRequest(detail);
                setProcesses(detail.order_process);
            } catch (error: unknown) {
                const err = error as Error;
                toast.error(err.message);
            }
        },
        [baseUrl, line]
    );

    const selectRequest = (reqId: number) => {
        setSelectedRequestId(reqId);
        fetchRequestDetail(reqId);
    };

    useEffect(() => {
        if (!selectedRequestId) return;

        const interval = setInterval(() => {
            fetchRequestDetail(selectedRequestId);
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedRequestId, fetchRequestDetail]);

    return {
        selectedRequestId,
        selectedRequest,
        selectRequest,
        processes,
    };
};
