"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useEffect } from "react";
import RequestModal from "@/components/modal/RequestModal";

import { useSubmitRequest } from "@/hooks/useSubmitRequest";
import { useMasterData } from "@/hooks/useMasterData";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { useRequestList } from "@/hooks/useRequestList";
import FactoryLine from "@/components/FactoryLine";
import QrScanInput from "@/components/QrScanInput";
import DashboardCard from "@/components/cards/DashboardCard";
import ProductionDataCard from "@/components/cards/ProductionDataCard";
import ManPowerCard from "@/components/cards/ManPowerCard";
import DefectTypeCard from "@/components/cards/DefectTypeCard";
import DefectProcessCard from "@/components/cards/DefectProcessCard";
import ProcessLayoutCard from "@/components/cards/ProcessLayoutCard";
import SOPTable from "@/components/cards/SOPTable";

export default function Dashboard() {
    const defaultFormData = {
        buyer_id: undefined,
        cutting_id: undefined,
        supervisor_id: undefined,
    };

    const [line, setLine] = useState("1");
    const [, setSelectedQrCode] = useState<string | null>(null);
    const [, setStage] = useState("");

    // Get line
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        setLine(line);
    }, []);

    // Submit request
    const {
        formData,
        setFormData,
        isRequestModalOpen,
        setIsRequestModalOpen,
        refetchSignal,
        handleSubmit,
    } = useSubmitRequest({ line, defaultFormData });

    // Get master data
    const {
        cuttings,
        // buyers,
        // styles,
        supervisors,
        defectTypes,
        loading,
    } = useMasterData();

    // Get request detail
    const { selectedRequestId, selectedRequest, selectRequest, processes } =
        useRequestDetail(line);

    // Get request list
    const { requests } = useRequestList(line, refetchSignal);

    // Get active tab
    // const [activeTab, setActiveTab] = useState<string>(() =>
    //     requests.length > 0 ? requests[0].id.toString() : ""
    // );
    const [activeTab, setActiveTab] = useState<string>("");

    useEffect(() => {
        if (requests.length > 0 && !activeTab) {
            setActiveTab(requests[0].id.toString());
        }
    }, [requests, activeTab]);

    // Get defect types
    const defaultDefectData = Array.isArray(defectTypes)
        ? defectTypes.reduce((acc, item) => {
              acc[item.key] = 0;
              return acc;
          }, {} as Record<string, number>)
        : {};

    const defectData = {
        ...defaultDefectData,
        ...(selectedRequest?.defect_summary || {}),
    };

    // Get today
    const isToday = (dateStr: string) => {
        const requestDate = new Date(dateStr);
        const today = new Date();
        return (
            requestDate.getFullYear() === today.getFullYear() &&
            requestDate.getMonth() === today.getMonth() &&
            requestDate.getDate() === today.getDate()
        );
    };

    // Disable zoom functionality
    useEffect(() => {
        // Prevent zoom on touch devices
        const preventZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // Prevent zoom with keyboard shortcuts
        const preventKeyboardZoom = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === "+" ||
                    e.key === "-" ||
                    e.key === "=" ||
                    e.key === "0")
            ) {
                e.preventDefault();
            }
        };

        // Prevent wheel zoom
        const preventWheelZoom = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener("touchstart", preventZoom, {
            passive: false,
        });
        document.addEventListener("keydown", preventKeyboardZoom);
        document.addEventListener("wheel", preventWheelZoom, {
            passive: false,
        });

        // Set viewport meta tag to prevent zoom
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "viewport";
            meta.content =
                "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
            document.head.appendChild(meta);
        }

        // Cleanup function
        return () => {
            document.removeEventListener("touchstart", preventZoom);
            document.removeEventListener("keydown", preventKeyboardZoom);
            document.removeEventListener("wheel", preventWheelZoom);
        };
    }, []);

    return (
        <div
            className="flex min-h-screen flex-col select-none"
            style={{
                // touchAction: "none",
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                transform: "scale(1)",
                transformOrigin: "top left",
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Header Section */}
            <header className="flex items-center justify-between border-b px-4 py-2 bg-white">
                {/* Left side - Add Request button and Factory/Line information */}
                <div className="flex items-center gap-4">
                    {/* Add Request Dialog Button */}
                    <Button
                        onClick={() => {
                            setFormData(defaultFormData);
                            setIsRequestModalOpen(true);
                        }}
                    >
                        Add Request
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FactoryLine />
                        </div>
                    </div>
                </div>
                {/* Right side - Current date/time and QR scan */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {/* Real-time date and time display */}
                        <span className="text-xl font-bold text-gray-900">
                            {new Date()
                                .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                .replace(/\//g, "-")}{" "}
                            {new Date().toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    {/* QR Scan Input */}
                    <div className="relative">
                        {selectedRequest?.order_info?.date &&
                            isToday(selectedRequest.order_info.date) && (
                                <div className="ml-auto">
                                    <QrScanInput
                                        requestId={
                                            selectedRequestId ?? undefined
                                        }
                                        onQrCodeChange={(data) =>
                                            setSelectedQrCode(data)
                                        }
                                        onStage={() => setStage("process")}
                                        defectTypes={defectTypes}
                                        processes={processes}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4">
                {/* Request Tabs */}
                {requests.length > 0 && (
                    <div className="mb-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="flex w-auto gap-1">
                                {requests.map((request) => (
                                    <TabsTrigger
                                        key={request.id}
                                        value={request.id.toString()}
                                        className="flex items-center px-3 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                                        onClick={() =>
                                            selectRequest?.(request.id)
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    request.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : request.status ===
                                                          "rejected"
                                                        ? "bg-red-500"
                                                        : request.status ===
                                                          "approved"
                                                        ? "bg-green-500"
                                                        : "bg-gray-400"
                                                }`}
                                            />
                                            <span className="font-medium whitespace-nowrap">
                                                {request.order_code} |{" "}
                                                {request.code} | {request.buyer}{" "}
                                                | {request.style}
                                            </span>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {requests.map((request) => (
                                <TabsContent
                                    key={request.id}
                                    value={request.id.toString()}
                                    className="mt-4"
                                >
                                    {/* Content Tabs */}
                                    <Tabs
                                        defaultValue="general"
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-5">
                                            <TabsTrigger
                                                value="general"
                                                className="flex-1 text-center data-[state=active]:bg-black data-[state=active]:text-white"
                                            >
                                                General
                                            </TabsTrigger>
                                            <TabsTrigger value="result">
                                                Result
                                            </TabsTrigger>
                                            <TabsTrigger value="quality-manpower">
                                                Quality & Man Power
                                            </TabsTrigger>
                                            <TabsTrigger value="layout">
                                                Layout
                                            </TabsTrigger>
                                            <TabsTrigger value="sop">
                                                SOP
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="general">
                                            <DashboardCard
                                                selectedRequest={
                                                    selectedRequest
                                                }
                                            />
                                        </TabsContent>

                                        <TabsContent value="result">
                                            {/* Production Table */}
                                            <ProductionDataCard
                                                data={
                                                    selectedRequest?.production_data
                                                }
                                            />
                                        </TabsContent>

                                        <TabsContent value="quality-manpower">
                                            {/* Quality & Man Power - Grid 3 Columns */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {/* Man Power Card */}
                                                <ManPowerCard
                                                    data={
                                                        selectedRequest?.man_power
                                                    }
                                                />

                                                {/* Defect Card */}
                                                <DefectTypeCard
                                                    data={defectData}
                                                    types={defectTypes}
                                                    loading={loading}
                                                />

                                                {/* Defect Process Card */}
                                                <DefectProcessCard
                                                    data={
                                                        selectedRequest?.process_summary ?? {
                                                            total_defect: 0,
                                                            processes: [],
                                                        }
                                                    }
                                                    loading={loading}
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="layout">
                                            {/* Process Layout Table */}
                                            <ProcessLayoutCard
                                                data={
                                                    selectedRequest?.process_layout ??
                                                    []
                                                }
                                            />
                                        </TabsContent>

                                        <TabsContent value="sop">
                                            {/* SOP Table */}
                                            <SOPTable
                                                sopData={
                                                    selectedRequest?.sop_data ??
                                                    []
                                                }
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                )}

                {/* Default Content when no tabs */}
                {requests.length === 0 && (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <p className="text-lg font-medium mb-2">
                                No requests selected
                            </p>
                            <p className="text-sm">
                                Click the &quot;Add&quot; button to add a new
                                request
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <RequestModal
                open={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                cuttings={cuttings}
                supervisors={supervisors}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
