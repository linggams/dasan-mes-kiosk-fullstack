import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import {Input} from "@/components/ui/input";

interface QRScan {
    count?: number;
    onScan: (qrCode: string) => void;
}

export default function QRScanCard({ count = 0, onScan }: QRScan) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onScan(searchQuery);
            setSearchQuery("");
        }
    };

    return (
        <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1">
                    <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 flex items-center">
                        <FontAwesomeIcon
                            icon={faQrcode}
                            className="text-blue-500 text-xl mr-2"
                        />
                        <Input
                            type="text"
                            placeholder="Scan QR Code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-72 border-none"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-2 text-center">
                <div className="text-sm text-gray-500">Count</div>
                <div className="text-6xl font-bold text-gray-800" id="count">
                    {count.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
