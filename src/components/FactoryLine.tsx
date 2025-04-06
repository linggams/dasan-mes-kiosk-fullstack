"use client";

import {useEffect, useState} from "react";

export default function FactoryLine() {
    const [factory, setFactory] = useState("1");
    const [line, setLine] = useState("1");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const factory = params.get("factory") ?? "1";
        const line = params.get("line") ?? "1";
        setFactory(factory);
        setLine(line);
    }, []);

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">FACTORY {factory}</span>
            <span className="font-bold text-lg">LINE {line}</span>
        </div>
    );
}
