"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import QrScanModal from "@/components/modal/QrScanModal";
import { toast } from "sonner";
import { QRData } from "@/types/qr";
import DefectTypeModal from "@/components/modal/DefectTypeModal";
import ProcessModal from "@/components/modal/ProcessModal";
// import ActionModal from "@/components/modal/ActionModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { MasterDefectType, MasterProcess } from "@/hooks/useMasterData";

type Props = {
    requestId?: number | null;
    fetchRequestDetail: (id: number) => void;
    onQrCodeChange?: (code: string) => void;
    onStage?: (stage: string) => void;
    defectTypes: MasterDefectType[];
    processes: MasterProcess[];
};

export default function QrScanInput({
    requestId,
    fetchRequestDetail,
    onQrCodeChange,
    onStage,
    defectTypes,
    processes,
}: Props) {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
    const [line, setLine] = useState("1");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        setLine(line);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrData, setQrData] = useState<QRData | null>(null);
    const [isDefectTypeModalOpen, setIsDefectTypeModalOpen] = useState(false);
    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedDefects, setSelectedDefects] = useState<MasterDefectType[]>(
        []
    );
    const [defectProcessMap, setDefectProcessMap] = useState<
        Record<string, number[]>
    >({});

    const processOptions = processes.map((p) => ({
        value: p.id,
        label: p.name,
    }));

    const handleScan = async () => {
        if (!searchQuery.trim() || !requestId) return;

        try {
            const res = await fetch(
                `${baseUrl}/kiosk/sewing/scan?line=${line}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: requestId,
                        qr_code: searchQuery.trim(),
                    }),
                }
            );

            const result = await res.json();
            if (!res.ok) {
                const errorMsg = Array.isArray(result.errors)
                    ? result.errors.join(", ")
                    : result.errors || "Unknown error";
                toast.warning(errorMsg);
                setSearchQuery("");
                return;
            }

            const data = result.data;

            const scannedData: QRData = {
                buyer: data.buyer,
                style: data.style,
                size: data.size,
                color: data.color,
                purchaseOrder: data.purchase_order,
                destination: data.destination,
                qrNumber: data.qr_number,
            };

            onQrCodeChange?.(data.qr_number);
            onStage?.("process");
            setQrData(scannedData);
            setIsQrModalOpen(true);
            setSearchQuery("");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
            setSearchQuery("");
        }
    };

    const handlePass = async () => {
        if (!requestId || !qrData?.qrNumber) return;

        try {
            const res = await fetch(
                `${baseUrl}/kiosk/sewing/pass?line=${line}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: requestId,
                        qr_code: qrData?.qrNumber,
                    }),
                }
            );

            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message);
                return;
            }

            onStage?.("finishing");
            setIsQrModalOpen(false);
            setSearchQuery("");
            fetchRequestDetail(requestId);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
            setSearchQuery("");
        }
    };

    const handleFail = () => {
        setIsQrModalOpen(false);
        setSelectedDefects([]);
        setIsDefectTypeModalOpen(true);
    };

    const handleBackToQrScan = () => {
        setIsDefectTypeModalOpen(false);
        setIsQrModalOpen(true);
    };

    const handleProcessSelect = (defectKey: string, processIds: number[]) => {
        setDefectProcessMap((prev) => ({
            ...prev,
            [defectKey]: processIds,
        }));
    };

    const handleRework = async (isRework: boolean) => {
        if (!requestId || !qrData?.qrNumber) return;

        try {
            const res = await fetch(
                `${baseUrl}/kiosk/sewing/fail?line=${line}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: requestId,
                        qr_code: qrData.qrNumber,
                        defects: selectedDefects.map((d) => ({
                            key: d.key,
                            processes: defectProcessMap[d.key] || [],
                        })),
                        is_rework: isRework,
                    }),
                }
            );

            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message);
                return;
            }

            fetchRequestDetail(requestId);
            onStage?.("finishing");

            setIsProcessModalOpen(false);
            setSelectedDefects([]);
            setDefectProcessMap({});
            setQrData(null);
            setSearchQuery("");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
            setSearchQuery("");
        } finally {
            setSelectedDefects([]);
        }
    };

    const handleBackToDefect = () => {
        setIsActionModalOpen(false);
        setIsDefectTypeModalOpen(true);
    };

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (isQrModalOpen || isDefectTypeModalOpen || isActionModalOpen) {
            inputRef.current?.blur();
        } else {
            inputRef.current?.focus();
        }
    }, [isQrModalOpen, isDefectTypeModalOpen, isActionModalOpen]);

    return (
        <div className="ml-auto flex items-center border border-gray-300 rounded-lg px-3 w-72 bg-white">
            <FontAwesomeIcon
                icon={faQrcode}
                className="text-blue-500 text-xl mr-2"
            />
            <Input
                ref={inputRef}
                type="text"
                placeholder="Scan QR Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleScan();
                    }
                }}
                className="w-72 border-none"
            />

            {/* Step 1: Modal QR Scan Details */}
            <QrScanModal
                open={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                qrData={qrData}
                onPass={handlePass}
                onFail={handleFail}
            />

            {/* Step 2: Modal Defect Type */}
            <DefectTypeModal
                open={isDefectTypeModalOpen}
                onClose={() => setIsDefectTypeModalOpen(false)}
                onBack={handleBackToQrScan}
                onSelect={(defects) => {
                    setSelectedDefects(defects);
                    setIsDefectTypeModalOpen(false);
                    setIsProcessModalOpen(true);
                }}
                types={defectTypes}
            />

            {/* Step 3: Select a process to defect */}
            <ProcessModal
                open={isProcessModalOpen}
                onClose={() => setIsProcessModalOpen(false)}
                onBack={handleBackToDefect}
                onNext={() => handleRework(true)}
                selectedDefects={selectedDefects}
                processOptions={processOptions}
                selectedProcesses={defectProcessMap}
                onProcessSelect={handleProcessSelect}
            />

            {/* Step 4: Modal Action Selection */}
            {/* <ActionModal
                open={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                onBack={handleBackToDefect}
                onFail={handleRework}
            /> */}
        </div>
    );
}
