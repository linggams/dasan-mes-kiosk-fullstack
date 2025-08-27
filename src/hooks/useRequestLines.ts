import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RequestLinesTypes } from "@/types/lines";
import { kiosk } from "@/lib/axios";
import { ApiResponse } from "@/types/response";

export const useRequestLines = (
    selectedFactory: string,
    currentDate?: Date
) => {
    // const [isLoading, setIsLoading] = useState(false);
    const [selectedRequestLines, setSelectedRequestLines] = useState<
        RequestLinesTypes[]
    >([]);

    const fetchRequestLines = useCallback(async () => {
        const parseSelectedFactory = selectedFactory
            ? JSON.parse(selectedFactory)
            : null;
        const factoryQuery = parseSelectedFactory
            ? `?factory=${parseSelectedFactory.id}`
            : "";

        const dateQuery = currentDate
            ? `&date=${currentDate.toISOString().split("T")[0]}`
            : "";

        // setIsLoading(true);

        try {
            const result = await kiosk.get<ApiResponse<RequestLinesTypes[]>>(
                `/lines${factoryQuery}${dateQuery}`
            );

            // if (result.status !== "success") {
            //     toast.warning(result.message || "Failed to fetch lines");
            //     setSelectedRequestLines([]);
            //     return;
            // }

            setSelectedRequestLines(result.data.data ?? []);
        } catch (error: unknown) {
            const err = error as Error;
            toast.error(err.message);
        }
    }, [selectedFactory, currentDate]);

    useEffect(() => {
        fetchRequestLines();
    }, [fetchRequestLines]);

    return { selectedRequestLines };
};
