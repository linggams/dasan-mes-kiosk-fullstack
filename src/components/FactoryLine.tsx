"use client";

import { useSearchParams } from "next/navigation";

export default function FactoryLine() {
    const searchParams = useSearchParams();
    const factory = searchParams.get("factory") || "?";
    const line = searchParams.get("line") || "?";

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg">FACTORY {factory}</span>
            <span className="font-bold text-lg">LINE {line}</span>
        </div>
    );
}
