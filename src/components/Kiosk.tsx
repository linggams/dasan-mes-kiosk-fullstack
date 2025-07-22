"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layouts/header";
import Sidebar from "@/components/layouts/sidebar";

import FactoryLine from "@/components/FactoryLine";
import RequestInfo from "@/components/RequestInfo";
import RequestListPanel from "@/components/RequestListPanel";
import StageSelector from "@/components/StageSelector";
import QrScanInput from "@/components/QrScanInput";
import ImagePreviewCard from "@/components/cards/ImagePreviewCard";
import OrderInfoCard from "@/components/cards/OrderInfoCard";
import ManPowerCard from "@/components/cards/ManPowerCard";
import DefectTypeCard from "@/components/cards/DefectTypeCard";
import DefectProcessCard from "@/components/cards/DefectProcessCard";
import ProductionDataCard from "@/components/cards/ProductionDataCard";
import RequestModal from "@/components/modal/RequestModal";
import FactoryPacking from "@/components/FactoryPacking";
import QRScanCard from "@/components/cards/QrScanCard";
import InformationCard from "@/components/cards/InformationCard";

import { usePackingScan } from "@/hooks/usePackingScan";
import { useUpdateStage } from "@/hooks/useUpdateStage";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { useSubmitRequest } from "@/hooks/useSubmitRequest";
import { useMasterData } from "@/hooks/useMasterData";

interface Type {
    type: "home" | "packing";
}

export default function Kiosk({ type }: Type) {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

    const [line, setLine] = useState("1");
    const [packing, setPacking] = useState("1");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const line = params.get("line") ?? "1";
        const packing = params.get("packing") ?? "1";
        setLine(line);
        setPacking(packing);
    }, []);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
    const [stage, setStage] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setDate(now.toLocaleDateString());
            setTime(now.toLocaleTimeString());
        }, 1000);

        if (window.innerWidth >= 768) {
            setIsSidebarOpen(true);
        }

        return () => clearInterval(interval);
    }, []);

    /**
     * Sewing: Create Request
     */
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
    } = useSubmitRequest({
        baseUrl,
        line,
        defaultFormData,
    });

    const { buyers, styles, supervisors, defectTypes, processes, loading } =
        useMasterData(baseUrl, formData.buyer_id);

    const handleOpenRequestModal = () => {
        setFormData(defaultFormData);
        setIsRequestModalOpen(true);
    };

    /**
     * Sewing: Fetch Request Detail
     */
    const { selectedRequestId, selectedRequest, fetchRequestDetail } =
        useRequestDetail(baseUrl, line);

    /**
     * Sewing Get Defect Types
     */
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

    /**
     * Sewing: Update Stage Request Item
     */
    const { updateStage } = useUpdateStage({
        baseUrl,
        line,
        selectedQrCode,
        selectedRequestId,
    });

    /**
     * Packing: Scan Qr Code
     */
    const {
        count,
        qrPackingData,
        imagePreview,
        productionData,
        handlePackingScan,
    } = usePackingScan({ baseUrl, packing });

    /**
     * Helper
     * @param dateStr
     * @returns
     */
    const isToday = (dateStr: string) => {
        const requestDate = new Date(dateStr);
        const today = new Date();

        return (
            requestDate.getFullYear() === today.getFullYear() &&
            requestDate.getMonth() === today.getMonth() &&
            requestDate.getDate() === today.getDate()
        );
    };

    const processOptions = processes.map((p) => ({
        label: p.name,
        value: typeof p.id === "string" ? parseInt(p.id, 10) : p.id,
    }));

    return (
        <div className="flex">
            {/* Sidebar */}
            {type !== "packing" && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    handleOpenRequestModal={handleOpenRequestModal}
                    fetchRequestDetail={fetchRequestDetail}
                    selectedRequestId={selectedRequestId ?? undefined}
                    refetchSignal={refetchSignal}
                />
            )}

            {/* Main Content */}
            <div
                className={`p-6 space-y-6 transition-all w-full ${
                    type !== "packing" && isSidebarOpen ? "ml-64" : ""
                }`}
            >
                {/* Header */}
                <Header
                    type={type}
                    date={date}
                    time={time}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Info Bar */}
                {type !== "packing" && (
                    <Card className="p-4 bg-white/80 border border-gray-200">
                        {selectedRequest && (
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
                        )}
                    </Card>
                )}

                {/* Tabs */}
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

                    {/* General Tab */}
                    <TabsContent value="general" className="space-y-6">
                        {/* Order Information & Metrics */}
                        <div className="grid grid-cols-5 gap-4">
                            {/* Image Preview */}
                            {type !== "packing" && (
                                <ImagePreviewCard
                                    data={selectedRequest?.image_preview}
                                />
                            )}

                            {/* Order Information */}
                            {type !== "packing" && (
                                <OrderInfoCard
                                    data={selectedRequest?.order_info}
                                />
                            )}

                            {/* Man Power */}
                            {type !== "packing" && (
                                <ManPowerCard
                                    data={selectedRequest?.man_power}
                                />
                            )}

                            {/* Defect Type */}
                            {type !== "packing" && (
                                <DefectTypeCard
                                    data={{
                                        ...defectData,
                                        ...(selectedRequest?.defect_summary ||
                                            {}),
                                    }}
                                    types={defectTypes}
                                    loading={loading}
                                />
                            )}

                            {/* Defect Type */}
                            {type !== "packing" && (
                                <DefectProcessCard
                                    data={{
                                        ...(selectedRequest?.process_summary ||
                                            {}),
                                    }}
                                    processes={processOptions.map((p) => ({
                                        id: p.value,
                                        name: p.label,
                                    }))}
                                    loading={loading}
                                />
                            )}

                            {/* Image Preview */}
                            {type === "packing" && (
                                <ImagePreviewCard data={imagePreview} />
                            )}

                            {/* Information */}
                            {type === "packing" && (
                                <InformationCard data={qrPackingData} />
                            )}

                            {/* Qr Code */}
                            {type === "packing" && (
                                <QRScanCard
                                    count={count}
                                    onScan={handlePackingScan}
                                />
                            )}
                        </div>

                        {/* Production Data Table */}
                        {type !== "packing" && (
                            <ProductionDataCard
                                data={selectedRequest?.production_data}
                            />
                        )}

                        {type === "packing" && (
                            <ProductionDataCard data={productionData} />
                        )}
                    </TabsContent>

                    {/* Layouts Tab */}
                    <TabsContent value="layouts">
                        {/* You can replace this with your actual layout table component */}
                        <div className="bg-white rounded-lg border p-4">
                            <h2 className="text-lg font-semibold mb-4">
                                Process Layout Table
                            </h2>
                            {/* Table goes here */}
                            <ProductionDataCard
                                data={selectedRequest?.production_data}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Request Modal */}
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
