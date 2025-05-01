import { useState } from "react";
import { toast } from "sonner";
import {RequestFormData} from "@/types/request";

type UseSubmitRequestProps<T> = {
    baseUrl: string;
    line: string;
    defaultFormData: T;
};

export const useSubmitRequest = <T extends Record<string, unknown>>({
                                                                    baseUrl,
                                                                    line,
                                                                    defaultFormData,
                                                                }: UseSubmitRequestProps<T>) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [refetchSignal, setRefetchSignal] = useState(false);
    const [formData, setFormData] = useState<RequestFormData>({
        buyer_id: undefined,
        cutting_id: undefined,
        line_id: undefined,
        supervisor_id: undefined,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch(`${baseUrl}/kiosk/sewing?line=${line}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                mode: "cors",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.errors || "Failed to submit request.");
            }

            toast.success("Request created successfully");
            setIsRequestModalOpen(false);
            setRefetchSignal((prev) => !prev);
            setFormData(defaultFormData);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
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
