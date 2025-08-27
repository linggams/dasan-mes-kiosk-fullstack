import { useEffect, useState } from "react";
import { toast } from "sonner";
import { master } from "@/lib/axios";

export type MasterCutting = {
    id: number;
    order_id: number;
    name: string;
};

export type MasterSupervisor = {
    id: number;
    name: string;
};

export type MasterDefectType = {
    key: string;
    label: string;
};

export const useMasterData = () => {
    const [cuttings, setCuttings] = useState<MasterCutting[]>([]);
    const [supervisors, setSupervisors] = useState<MasterSupervisor[]>([]);
    const [defectTypes, setDefectTypes] = useState<MasterDefectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [cuttingsRes, supervisorsRes, defectTypesRes] =
                    await Promise.all([
                        master.get("/cuttings"),
                        master.get("/supervisors"),
                        master.get("/defect-types"),
                    ]);

                setCuttings(cuttingsRes.data);
                setSupervisors(supervisorsRes.data);
                setDefectTypes(defectTypesRes.data);
            } catch (error: unknown) {
                const err = error as Error;
                toast.error(`Error fetching master data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        cuttings,
        supervisors,
        defectTypes,
        loading,
    };
};
