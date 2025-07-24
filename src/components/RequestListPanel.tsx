"use client";

import React, { useEffect, useState } from "react";
import { useRequestList } from "@/hooks/useRequestList";

type Props = {
    fetchRequestDetail?: (id: number) => void;
    requestId?: number | null;
    refetchSignal?: boolean;
};

<<<<<<< Updated upstream
=======
function formatDate(dateStr: string) {
    try {
        return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
        return dateStr;
    }
}

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "approved":
            return "bg-green-400 border-green-500";
        case "pending":
            return "bg-yellow-400 border-yellow-500";
        case "rejected":
            return "bg-red-400 border-red-500";
        default:
            return "bg-gray-300 border-gray-400";
    }
}

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        <div className="py-1 overflow-y-auto h-[calc(100vh-64px)]">
            {requests ? (
                requests.map((request) => {
                    const isSelected = request.id === requestId;

                    return (
                        <div
                            key={request.id}
                            className={`border-b border-gray-200 py-2 px-2 cursor-pointer transition-colors ${
                                isSelected
                                    ? "bg-blue-50 hover:bg-blue-100"
                                    : "hover:bg-gray-50"
                            }`}
                            onClick={() => fetchRequestDetail?.(request.id)}
                        >
                            <div className="flex justify-between items-center">
                                {/* LEFT */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======

                                {/* RIGHT */}
                                <div
                                    className={`w-3 h-3 rounded-full ${getStatusColor(
                                        request.status
                                    )}`}
                                ></div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-sm text-gray-500 px-2 py-4">
                    Loading requests...
                </p>
            )}
>>>>>>> Stashed changes
        </div>
    );
}
