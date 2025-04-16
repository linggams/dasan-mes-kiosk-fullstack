import { useEffect, useState } from "react";
import { toast } from "sonner";

type DefectType = { key: string; label: string };

export function useDefectTypes() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
    const [defectTypes, setDefectTypes] = useState<DefectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDefectTypes() {
            try {
                const res = await fetch(`${baseUrl}/kiosk/master/defect-types`);
                const json = await res.json();
                setDefectTypes(json.data);
            } catch (err: unknown) {
                const error = err as Error;
                toast.error(error.message || "Failed to fetch defect types");
            } finally {
                setLoading(false);
            }
        }

        fetchDefectTypes();
    }, [baseUrl]);

    return { defectTypes, loading };
}