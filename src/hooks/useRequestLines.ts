import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RequestLinesTypes } from "@/types/lines";
import { kiosk } from "@/lib/axios";
import { ApiResponse } from "@/types/response";

export const useRequestLines = (
    selectedFactory: string,
    currentDate: Date | undefined
) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRequestLines, setSelectedRequestLines] = useState<
        Array<RequestLinesTypes>
    >([]);

    const fetchRequestLines = useCallback(async () => {
        const parseSelectedFactory = selectedFactory
            ? JSON.parse(selectedFactory)
            : null;
        const factoryQuery = parseSelectedFactory
            ? `?factory=${parseSelectedFactory.id}`
            : "";

        setIsLoading(true);

        try {
            const result = await kiosk.get<ApiResponse<RequestLinesTypes[]>>(
                `/lines${factoryQuery}`
            );

            if (result.status !== "success") {
                toast.warning(result.message || "Failed to fetch lines");
                setSelectedRequestLines([]);
                return;
            }

            setSelectedRequestLines(result.data ?? []);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [selectedFactory, currentDate]);

    useEffect(() => {
        fetchRequestLines();
    }, [fetchRequestLines]);

    return {
        selectedRequestLines,
        isLoading,
    };
};
