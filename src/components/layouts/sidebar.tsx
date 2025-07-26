"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RequestListPanel from "@/components/RequestListPanel";

export default function Sidebar({
    isOpen,
    onClose,
    handleOpenRequestModal,
    fetchRequestDetail,
    selectedRequestId,
    refetchSignal,
}: {
    isOpen: boolean;
    onClose: () => void;
    handleOpenRequestModal: () => void;
    fetchRequestDetail: (id: number) => void | Promise<void>;
    selectedRequestId?: number;
    refetchSignal?: boolean;
}) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className="fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-sm border-r border-gray-200 py-4 z-40 transition-transform duration-300 shadow-lg"
            >
                {/* Close Button (for mobile) */}
                <div className="mb-4 flex justify-end md:hidden px-4">
                    <Button size="icon" variant="ghost" onClick={onClose}>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-xl text-gray-500"
                        />
                    </Button>
                </div>

                {/* Request Button */}
                <div className="mb-4 px-6">
                    <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                        onClick={handleOpenRequestModal}
                    >
                        Request
                    </Button>
                </div>

                {/* List Panel */}
                <div className="overflow-y-auto h-[calc(100vh-120px)] pr-1">
                    <RequestListPanel
                        fetchRequestDetail={fetchRequestDetail}
                        requestId={selectedRequestId}
                        refetchSignal={!!refetchSignal}
                    />
                </div>
            </aside>
        </>
    );
}
