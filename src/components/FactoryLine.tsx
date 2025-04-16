"use client";

import {useEffect, useState} from "react";

export default function FactoryLine() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`

    const [factoryName, setFactoryName] = useState("");
    const [lineName, setLineName] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const line = params.get("line") ?? "1";

        fetch(`${baseUrl}/kiosk/master/factory-line?factory=${factory}&line=${line}`)
            .then((res) => res.json())
            .then((data) => {
                setFactoryName(data.factory);
                setLineName(data.line);
            });
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">{factoryName}</span>
            <span className="font-bold text-lg">{lineName}</span>
        </div>
    );
}
