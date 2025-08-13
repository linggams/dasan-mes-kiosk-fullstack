"use client";

import React, { useEffect, useState } from "react";
import { useRequestList } from "@/hooks/useRequestList";
import { format } from "date-fns";

type Props = {
    fetchRequestDetail?: (id: number) => void;
    requestId?: number | null;
    refetchSignal?: boolean;
};

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

export default function RequestListPanel({
    fetchRequestDetail,
    requestId,
    refetchSignal,
}: Props) {
    const [line, setLine] = useState<string>();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        setLine(line);
    }, []);

    const { requests } = useRequestList(line ?? "1", refetchSignal);

    return (
        <div className="py-1 overflow-y-auto h-[calc(100vh-64px)]">
            {requests ? (
                requests.map((request) => {
                    const isSelected = request.id === requestId;

                    return (
                        <div
                            key={request.id}
                            className={`border-b border-gray-200 py-2 px-4 cursor-pointer transition-colors ${
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
                                        {request.code}
                                    </span>
                                    <div className="text-xs mt-0.5 text-gray-500">
                                        <span className="font-medium">
                                            Buyer:
                                        </span>{" "}
                                        {request.buyer} •{" "}
                                        <span className="font-medium">
                                            Style:
                                        </span>{" "}
                                        {request.style}
                                    </div>
                                    <div className="text-xs mt-0.5 text-gray-400">
                                        {formatDate(request.date)}
                                    </div>
                                </div>

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
        </div>
    );
}
