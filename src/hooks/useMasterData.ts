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

export type MasterProcess = {
    id: number;
    name: string;
};

export const useMasterData = (baseUrl: string, buyerId?: number) => {
    const [buyers, setBuyers] = useState<MasterBuyer[]>([]);
    const [styles, setStyles] = useState<MasterStyle[]>([]);
    const [supervisors, setSupervisors] = useState<MasterSupervisor[]>([]);
    const [defectTypes, setDefectTypes] = useState<MasterDefectType[]>([]);
    const [processes, setProcesses] = useState<MasterProcess[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [buyersRes, supervisorsRes, defectTypesRes, processRes] =
                    await Promise.all([
                        fetch(`${baseUrl}/kiosk/master/buyers`),
                        fetch(`${baseUrl}/kiosk/master/supervisors`),
                        fetch(`${baseUrl}/kiosk/master/defect-types`),
                        fetch(`${baseUrl}/kiosk/master/processes`),
                    ]);

                const buyersData = await buyersRes.json();
                const supervisorsData = await supervisorsRes.json();
                const defectTypesData = await defectTypesRes.json();
                const processData = await processRes.json();

                setBuyers(buyersData.data);
                setSupervisors(supervisorsData.data);
                setDefectTypes(defectTypesData.data);
                setProcesses(processData.data);
            } catch (error: unknown) {
                const err = error as Error;
                toast.error(`Error fetching master data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    useEffect(() => {
        const fetchStyles = async () => {
            if (!buyerId) {
                setStyles([]);
                return;
            }

            try {
                const stylesRes = await fetch(
                    `${baseUrl}/kiosk/master/styles?buyer_id=${buyerId}`
                );
                const stylesData = await stylesRes.json();
                setStyles(stylesData.data);
            } catch (error: unknown) {
                const err = error as Error;
                toast.error(`Error fetching styles: ${err.message}`);
            }
        };

        fetchStyles();
    }, [buyerId, baseUrl]);

    return {
        buyers,
        styles,
        supervisors,
        defectTypes,
        processes,
        loading,
    };
};
