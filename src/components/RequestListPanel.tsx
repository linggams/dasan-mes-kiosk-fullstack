"use client";

import React, { useEffect, useState } from "react";
import { useRequestList } from "@/hooks/useRequestList";

type Props = {
    fetchRequestDetail?: (id: number) => void;
    requestId?: number | null;
    refetchSignal?: boolean;
};

export default function RequestListPanel({
    fetchRequestDetail,
    requestId,
    refetchSignal,
}: Props) {
    const [line, setLine] = useState("1");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        setLine(line);
    }, []);

    const { requests } = useRequestList(line, refetchSignal);

    return (
        <div>
            {/* Request List */}
            <div className="space-y-1.5">
                {requests ? (
                    requests.map((request, index) => {

                        const isSelected = request.id === requestId;

                        return (
                            <button
                                key={index}
                                className={`w-full p-2 rounded-lg transition-colors text-left
                                ${
                                    isSelected
                                        ? "bg-blue-100 hover:bg-blue-200"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                onClick={() => fetchRequestDetail?.(request.id)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span
                                        className={`text-xs ${
                                            isSelected
                                                ? "text-blue-800 font-semibold"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {request.code}
                                    </span>
                                    <span
                                        className={`uppercase text-xs px-2 py-0.5 rounded-full ${
                                            request.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : request.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                <div
                                    className={`text-xs ${
                                        isSelected
                                            ? "text-blue-700"
                                            : "text-gray-600"
                                    }`}
                                >
                                    <span>Buyer: {request.buyer}</span>
                                    <span className="mx-1">|</span>
                                    <span>Style: {request.style}</span>
                                    <br />
                                    <span>{request.date}</span>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <p className="text-gray-500">Loading requests...</p>
                )}
            </div>
        </div>
    );
}
