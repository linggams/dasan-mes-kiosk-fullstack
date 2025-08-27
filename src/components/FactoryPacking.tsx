"use client";

import { useEffect, useState } from "react";
import { master } from "@/lib/axios";

export default function FactoryPacking() {
    const [factoryName, setFactoryName] = useState("");
    const [packingName, setPackingName] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const packing = params.get("packing") ?? "1";

        master
            .get(`/factory-packing?factory=${factory}&packing=${packing}`)
            .then((res) => {
                setFactoryName(res.factory);
                setPackingName(res.packing);
            });
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{factoryName}</span>
            <span className="font-bold text-lg">{packingName}</span>
        </div>
    );
}
