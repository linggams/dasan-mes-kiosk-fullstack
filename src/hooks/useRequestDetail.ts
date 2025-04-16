import { useState } from "react";
import { toast } from "sonner";
import {ProductionData, RequestData} from "@/types/request";
import {ManPower, OrderInfo} from "@/types/order";

export type RequestDetail = {
    request_info: RequestData;
    image_preview: string;
    order_info: OrderInfo;
    man_power: ManPower;
    defect_summary: Record<string, number>;
    production_data: ProductionData;
};

export const useRequestDetail = (baseUrl: string, line: string) => {
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(null);

    const fetchRequestDetail = async (reqId: number) => {
        setSelectedRequestId(reqId);

        try {
            const res = await fetch(`${baseUrl}/kiosk/sewing/${reqId}?line=${line}`);
            const result = await res.json();

            if (result.status === "error") {
                toast.warning(result.errors);
                setSelectedRequest(null);
                return;
            }

            const detail = result.data;
            detail.defect_summary ??= {};
            setSelectedRequest(detail);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message);
        }
    };

    return {
        selectedRequestId,
        selectedRequest,
        fetchRequestDetail,
    };
};
