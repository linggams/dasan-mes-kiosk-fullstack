import { useEffect, useState } from "react";
import { toast } from "sonner";

export type MasterBuyer = {
    id: number;
    name: string;
};

export type MasterStyle = {
    id: number;
    style: string;
};

export type MasterSupervisor = {
    id: number;
    name: string;
};

export type MasterDefectType = {
    key: string;
    label: string;
};

export const useMasterData = (baseUrl: string) => {
    const [buyers, setBuyers] = useState<MasterBuyer[]>([]);
    const [styles, setStyles] = useState<MasterStyle[]>([]);
    const [supervisors, setSupervisors] = useState<MasterSupervisor[]>([]);
    const [defectTypes, setDefectTypes] = useState<MasterDefectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [buyersRes, stylesRes, supervisorsRes, defectTypesRes] = await Promise.all([
                    fetch(`${baseUrl}/kiosk/master/buyers`),
                    fetch(`${baseUrl}/kiosk/master/styles`),
                    fetch(`${baseUrl}/kiosk/master/supervisors`),
                    fetch(`${baseUrl}/kiosk/master/defect-types`),
                ]);

                const buyersData = await buyersRes.json();
                const stylesData = await stylesRes.json();
                const supervisorsData = await supervisorsRes.json();
                const defectTypesData = await defectTypesRes.json();

                setBuyers(buyersData.data);
                setStyles(stylesData.data);
                setSupervisors(supervisorsData.data);
                setDefectTypes(defectTypesData.data);
            } catch (error: unknown) {
                const err = error as Error;
                toast.error(`Error fetching master data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    return {
        buyers,
        styles,
        supervisors,
        defectTypes,
        loading,
    };
};
