"use client";

import {useEffect, useState} from "react";

export default function FactoryPacking() {
    const [factory, setFactory] = useState("1");
    const [packing, setPacking] = useState("1");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const packing = params.get("packing") ?? "1";
        setFactory(factory);
        setPacking(packing);
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">FACTORY {factory}</span>
            <span className="font-bold text-lg">PACKING {packing}</span>
        </div>
    );
}
