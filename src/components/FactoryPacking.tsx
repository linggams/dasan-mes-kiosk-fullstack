"use client";

import {useEffect, useState} from "react";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`

export default function FactoryPacking() {

    const [factoryName, setFactoryName] = useState("");
    const [packingName, setPackingName] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const packing = params.get("packing") ?? "1";

        fetch(`${baseUrl}/kiosk/master/factory-packing?factory=${factory}&packing=${packing}`)
            .then((res) => res.json())
            .then((data) => {
                setFactoryName(data.factory);
                setPackingName(data.packing);
            });
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{factoryName}</span>
            <span className="font-bold text-lg">{packingName}</span>
        </div>
    );
}
