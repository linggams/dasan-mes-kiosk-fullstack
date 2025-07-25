"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layouts/header";
import Sidebar from "@/components/layouts/sidebar";
import RequestInfo from "@/components/RequestInfo";
import StageSelector from "@/components/StageSelector";
import QrScanInput from "@/components/QrScanInput";
import ImagePreviewCard from "@/components/cards/ImagePreviewCard";
import OrderInfoCard from "@/components/cards/OrderInfoCard";
import ManPowerCard from "@/components/cards/ManPowerCard";
import DefectTypeCard from "@/components/cards/DefectTypeCard";
import DefectProcessCard from "@/components/cards/DefectProcessCard";
import ProductionDataCard from "@/components/cards/ProductionDataCard";
import RequestModal from "@/components/modal/RequestModal";
import ProcessLayoutCard from "@/components/cards/ProcessLayoutCard";

import { useSubmitRequest } from "@/hooks/useSubmitRequest";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { useMasterData } from "@/hooks/useMasterData";
import { useUpdateStage } from "@/hooks/useUpdateStage";

export default function SewingPage() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

    const [line, setLine] = useState("1");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
    const [stage, setStage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        setLine(line);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setDate(now.toLocaleDateString());
            setTime(now.toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const disableCopyCut = (e: ClipboardEvent) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", disableContextMenu);
        document.addEventListener("copy", disableCopyCut);
        document.addEventListener("cut", disableCopyCut);

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu);
            document.removeEventListener("copy", disableCopyCut);
            document.removeEventListener("cut", disableCopyCut);
        };
    }, []);

    const defaultFormData = {
        buyer_id: undefined,
        cutting_id: undefined,
        supervisor_id: undefined,
    };

    const {
        formData,
        setFormData,
        isRequestModalOpen,
        setIsRequestModalOpen,
        refetchSignal,
        handleSubmit,
    } = useSubmitRequest({ baseUrl, line, defaultFormData });

    const { buyers, styles, supervisors, defectTypes, processes, loading } =
        useMasterData(baseUrl, formData.buyer_id);

    const { selectedRequestId, selectedRequest, fetchRequestDetail } =
        useRequestDetail(baseUrl, line);

    const { updateStage } = useUpdateStage({
        baseUrl,
        line,
        selectedQrCode,
        selectedRequestId,
    });

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

    const processOptions = processes.map((p) => ({
        label: p.name,
        value: typeof p.id === "string" ? parseInt(p.id, 10) : p.id,
    }));

    const isToday = (dateStr: string) => {
        const requestDate = new Date(dateStr);
        const today = new Date();
        return (
            requestDate.getFullYear() === today.getFullYear() &&
            requestDate.getMonth() === today.getMonth() &&
            requestDate.getDate() === today.getDate()
        );
    };

    return (
        <div className="flex select-none">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                handleOpenRequestModal={() => {
                    setFormData(defaultFormData);
                    setIsRequestModalOpen(true);
                }}
                fetchRequestDetail={fetchRequestDetail}
                selectedRequestId={selectedRequestId ?? undefined}
                refetchSignal={refetchSignal ?? undefined}
            />

            <div
                className={`p-6 space-y-6 transition-all w-full ${
                    isSidebarOpen ? "ml-64" : ""
                }`}
            >
                <Header
                    type="home"
                    date={date}
                    time={time}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {selectedRequest && (
                    <Card className="p-4 bg-white/80 border border-gray-200">
                        <div className="flex space-x-4">
                            <RequestInfo
                                code={selectedRequest?.request_info?.code}
                                buyer={selectedRequest?.request_info?.buyer}
                                style={selectedRequest?.request_info?.style}
                            />
                            <div className="flex ml-auto pull-right">
                                <StageSelector
                                    value={stage}
                                    onChange={updateStage}
                                />
                                {selectedRequest?.order_info?.date &&
                                    isToday(
                                        selectedRequest.order_info.date
                                    ) && (
                                        <div className="ml-auto">
                                            <QrScanInput
                                                requestId={
                                                    selectedRequestId ??
                                                    undefined
                                                }
                                                fetchRequestDetail={
                                                    fetchRequestDetail
                                                }
                                                onQrCodeChange={(data) =>
                                                    setSelectedQrCode(data)
                                                }
                                                onStage={() =>
                                                    setStage("process")
                                                }
                                                defectTypes={defectTypes}
                                                processes={processes}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </Card>
                )}

                <Tabs defaultValue="general" className="w-full space-y-6">
                    <TabsList className="w-full flex">
                        <TabsTrigger
                            value="general"
                            className="flex-1 text-center data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="layouts"
                            className="flex-1 text-center data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Layout
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <div className="grid grid-cols-5 gap-4">
                            <ImagePreviewCard
                                data={selectedRequest?.image_preview}
                            />
                            <OrderInfoCard data={selectedRequest?.order_info} />
                            <ManPowerCard data={selectedRequest?.man_power} />
                            <DefectTypeCard
                                data={defectData}
                                types={defectTypes}
                                loading={loading}
                            />
                            <DefectProcessCard
                                data={selectedRequest?.process_summary || {}}
                                processes={processOptions.map((p) => ({
                                    id: p.value,
                                    name: p.label,
                                }))}
                                loading={loading}
                            />
                        </div>

                        <ProductionDataCard
                            data={selectedRequest?.production_data}
                        />
                    </TabsContent>

                    <TabsContent value="layouts">
                        <ProcessLayoutCard
                            data={selectedRequest?.process_layout ?? []}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <RequestModal
                open={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                buyers={buyers}
                styles={styles}
                supervisors={supervisors}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
