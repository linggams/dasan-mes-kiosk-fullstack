import { useState } from "react";
import { toast } from "sonner";
import { RequestFormData } from "@/types/request";
import { kiosk } from "@/lib/axios";

type UseSubmitRequestProps<T> = {
    line: string;
    defaultFormData: T;
};

export const useSubmitRequest = <T extends Record<string, unknown>>({
    line,
    defaultFormData,
}: UseSubmitRequestProps<T>) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [refetchSignal, setRefetchSignal] = useState(false);
    const [formData, setFormData] = useState<RequestFormData>({
        id: undefined,
        // buyer_id: undefined,
        line_id: undefined,
        supervisor_id: undefined,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await kiosk.post(`/sewing?line=${line}`, formData);

            const result = res.data;

            // if (res.status === "error") {
            //     toast.warning(
            //         res.errors || res.message || "Something went wrong"
            //     );
            //     return;
            // }

            toast.success(result.message ?? "Request submitted");
            setIsRequestModalOpen(false);
            setRefetchSignal((prev) => !prev);
            setFormData(defaultFormData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Unexpected error occurred");
            }
        }
    };

    return {
        formData,
        setFormData,
        isRequestModalOpen,
        setIsRequestModalOpen,
        refetchSignal,
        handleSubmit,
    };
};
