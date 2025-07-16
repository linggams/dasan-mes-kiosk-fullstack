import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { LineInfoTypes, ProductionData } from "@/types/request";
import { OrderInfo } from "@/types/order";
import { format } from "date-fns";

export type RequestLinesTypes = {
  line_info: LineInfoTypes;
  order_info: OrderInfo & {
    defect: number;
    man_power: number;
  };
  production_data: ProductionData;
};

export const useRequestLines = (
  baseUrl: string,
  selectedFactory: string,
  currentDate: Date | undefined
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRequestLines, setSelectedRequestLines] = useState<
    Array<RequestLinesTypes> | []
  >([]);

  const fetchRequestLines = useCallback(async () => {
    const parseSelectedFactory = selectedFactory
      ? JSON.parse(selectedFactory)
      : null;
    const factoryQuery = parseSelectedFactory
      ? `?factory=${parseSelectedFactory.id}`
      : "";
    const requestDate =
      currentDate && factoryQuery
        ? `&request_date=${format(currentDate, "yyyy-MM-dd")}`
        : currentDate
        ? `?request_date=${format(currentDate, "yyyy-MM-dd")}`
        : "";

    setIsLoading(true);

    try {
      const res = await fetch(
        `${baseUrl}/kiosk/lines${factoryQuery}${requestDate}`
      );
      const result = await res.json();

      if (result.status === "error") {
        toast.warning(result.errors);
        setSelectedRequestLines([]);
        return;
      }

      const lines = result.data;
      setSelectedRequestLines(lines);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, selectedFactory, currentDate]);

  useEffect(() => {
    fetchRequestLines();
  }, [fetchRequestLines]);

  return {
    selectedRequestLines,
    isLoading,
  };
};
