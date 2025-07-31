"use client";

import { QRData } from "@/types/qr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    qrData: QRData | null;
    onPass: () => void;
    onFail: () => void;
};

export default function QrScanModal({
    open,
    onClose,
    qrData,
    onPass,
    onFail,
}: Props) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isInputFocused =
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                document.activeElement instanceof HTMLSelectElement;

            if (isInputFocused) return;

            if (e.key === "Enter") {
                e.preventDefault();
                onPass();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onPass, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="z-50 bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-xl text-gray-500"
                        />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Step 1
                    </h3>
                    <div className="space-y-3">
                        {qrData && (
                            <div className="grid grid-cols-3 gap-4 text-lg">
                                <span className="text-gray-500">Buyer</span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.buyer}
                                </span>
                                <span className="text-gray-500">Style</span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.style}
                                </span>
                                <span className="text-gray-500">Size</span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.size}
                                </span>
                                <span className="text-gray-500">Color</span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.color}
                                </span>
                                <span className="text-gray-500">
                                    Purchase Order
                                </span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.purchaseOrder}
                                </span>
                                <span className="text-gray-500">
                                    Destination
                                </span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.destination}
                                </span>
                                <span className="text-gray-500">QR Number</span>
                                <span className="col-span-2 font-bold text-gray-900">
                                    {qrData.qrNumber}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={onPass}
                            className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg"
                        >
                            Pass (Enter)
                        </button>
                        <button
                            onClick={onFail}
                            className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors text-lg"
                        >
                            Fail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
