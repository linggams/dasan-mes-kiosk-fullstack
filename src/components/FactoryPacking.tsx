"use client";

import { useEffect, useState } from "react";

export default function FactoryPacking() {
    const [factoryName, setFactoryName] = useState("");
    const [packingName, setPackingName] = useState("");

    interface FactoryPackingResponse {
        factory: string;
        packing: string;
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const packing = params.get("packing") ?? "1";

        (async () => {
            try {
                const res = await fetch(
                    `/api/master/factory-packing?factory=${factory}&packing=${packing}`
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: FactoryPackingResponse = await res.json();
                setFactoryName(data.factory);
                setPackingName(data.packing);
            } catch (err) {
                console.error("Failed to fetch factory packing:", err);
            }
        })();
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{factoryName}</span>
            <span className="font-bold text-lg">{packingName}</span>
        </div>
    );
}
