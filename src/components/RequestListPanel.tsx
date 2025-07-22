"use client";

import React, { useEffect, useState } from "react";
import { useRequestList } from "@/hooks/useRequestList";
import { Badge } from "@/components/ui/badge";
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
    switch (status) {
        case "approved":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-red-100 text-red-700";
    }
}

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
        <div className="py-1 px-2 overflow-y-auto h-[calc(100vh-64px)]">
            {requests ? (
                requests.map((request) => {
                    const isSelected = request.id === requestId;

                    return (
                        <div
                            key={request.id}
                            className={`border-b py-2 px-2 cursor-pointer transition-colors rounded ${
                                isSelected
                                    ? "bg-blue-50 hover:bg-blue-100"
                                    : "hover:bg-gray-50"
                            }`}
                            onClick={() => fetchRequestDetail?.(request.id)}
                        >
                            <div className="flex justify-between items-center">
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

                                <Badge
                                    className={getStatusColor(request.status)}
                                >
                                    {request.status}
                                </Badge>
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
