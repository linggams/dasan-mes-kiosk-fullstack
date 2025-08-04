import { useEffect, useState } from "react";
import { toast } from "sonner";

export type MasterCutting = {
    id: number;
    order_id: number;
    name: string;
};

// export type MasterBuyer = {
// id: number;
// name: string;
// };

// export type MasterStyle = {
//     id: number;
//     style: string;
// };

export type MasterSupervisor = {
    id: number;
    name: string;
};

export type MasterDefectType = {
    key: string;
    label: string;
};

export const useMasterData = (baseUrl: string) => {
    const [cuttings, setCuttings] = useState<MasterCutting[]>([]);
    // const [buyers, setBuyers] = useState<MasterBuyer[]>([]);
    // const [styles, setStyles] = useState<MasterStyle[]>([]);
    const [supervisors, setSupervisors] = useState<MasterSupervisor[]>([]);
    const [defectTypes, setDefectTypes] = useState<MasterDefectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [
                    cuttingsRes,
                    // buyersRes,
                    supervisorsRes,
                    defectTypesRes,
                ] = await Promise.all([
                    fetch(`${baseUrl}/kiosk/master/cuttings`),
                    // fetch(`${baseUrl}/kiosk/master/buyers`),
                    fetch(`${baseUrl}/kiosk/master/supervisors`),
                    fetch(`${baseUrl}/kiosk/master/defect-types`),
                ]);

                const cuttingsData = await cuttingsRes.json();
                // const buyersData = await buyersRes.json();
                const supervisorsData = await supervisorsRes.json();
                const defectTypesData = await defectTypesRes.json();

                setCuttings(cuttingsData.data);
                // setBuyers(buyersData.data);
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

    // useEffect(() => {
    //     const fetchStyles = async () => {
    //         if (!buyerId) {
    //             setStyles([]);
    //             return;
    //         }

    //         try {
    //             const stylesRes = await fetch(
    //                 `${baseUrl}/kiosk/master/styles?buyer_id=${buyerId}`
    //             );
    //             const stylesData = await stylesRes.json();
    //             setStyles(stylesData.data);
    //         } catch (error: unknown) {
    //             const err = error as Error;
    //             toast.error(`Error fetching styles: ${err.message}`);
    //         }
    //     };

    //     fetchStyles();
    // }, [buyerId, baseUrl]);

    return {
        cuttings,
        // buyers,
        // styles,
        supervisors,
        defectTypes,
        loading,
    };
};
