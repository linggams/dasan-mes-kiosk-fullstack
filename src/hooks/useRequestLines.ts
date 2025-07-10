import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LineInfoTypes, ProductionData } from "@/types/request";
import { OrderInfo } from "@/types/order";

export type RequestLinesTypes = {
  line_info: LineInfoTypes;
  order_info: OrderInfo & {
    defect: number;
    man_power: number;
  };
  production_data: ProductionData;
};

export const useRequestLines = (baseUrl: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRequestLines, setSelectedRequestLines] = useState<
    Array<RequestLinesTypes> | []
  >([]);

  const fetchRequestLines = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/kiosk/lines`);
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
  };

  useEffect(() => {
    fetchRequestLines();
  }, [baseUrl]);

  return {
    selectedRequestLines,
    isLoading,
  };
};
