"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

import FactoryLine from "@/components/FactoryLine";
import RequestInfo from "@/components/RequestInfo";
import RequestListPanel from "@/components/RequestListPanel";
import StageSelector from "@/components/StageSelector";
import QrScanInput from "@/components/QrScanInput";
import ImagePreviewCard from "@/components/cards/ImagePreviewCard";
import OrderInfoCard from "@/components/cards/OrderInfoCard";
import ManPowerCard from "@/components/cards/ManPowerCard";
import DefectTypeCard from "@/components/cards/DefectTypeCard";
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
    type: 'home' | 'packing';
}

export default function Kiosk({ type }: Type) {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`

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

    const {
        buyers,
        styles,
        supervisors,
        defectTypes,
        loading
    } = useMasterData(
        baseUrl,
        formData.buyer_id
    );

    const handleOpenRequestModal = () => {
        setFormData(defaultFormData);
        setIsRequestModalOpen(true);
    };


    /**
     * Sewing: Fetch Request Detail
     */
    const {
        selectedRequestId,
        selectedRequest,
        fetchRequestDetail,
    } = useRequestDetail(baseUrl, line);

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


    return (
        <div className="flex">
            {/* Toggle Button for Mobile */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-md shadow-md"
            >
                Menu
            </button>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            {type !== 'packing' && (
                <div
                    id="sidebar"
                    className={`fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 p-4 z-40 transform transition-transform duration-300 ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Close Button (visible only on small screens) */}
                    <div className="mb-4 flex justify-end">
                        <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500" />
                        </Button>
                    </div>

                    {/* Request Button */}
                    <div className="mb-4">
                        <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                            onClick={handleOpenRequestModal}
                        >
                            Request
                        </Button>
                    </div>

                    <div className="overflow-y-auto h-[calc(100vh-120px)] pr-1">
                        <RequestListPanel
                            fetchRequestDetail={fetchRequestDetail}
                            requestId={selectedRequestId ?? undefined}
                            refetchSignal={refetchSignal}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`p-6 space-y-6 transition-all w-full ${type !== 'packing' &&  isSidebarOpen ? "ml-64" : ""}`}>
                {/* Header */}
                <Card className="p-4 bg-white/80 border border-gray-200">
                    <div className="grid grid-cols-2 items-center">
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                <FontAwesomeIcon icon={faBars} />
                            </Button>
                            {type === 'packing' ? <FactoryPacking /> : <FactoryLine />}
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <span className="text-lg font-bold">{date}</span>
                            <span className="text-lg font-bold">{time}</span>
                        </div>
                    </div>
                </Card>

                {/* Info Bar */}
                {type !== 'packing' && (
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

                                    <div className="ml-auto">
                                        <QrScanInput
                                            requestId={selectedRequestId ?? undefined}
                                            fetchRequestDetail={fetchRequestDetail}
                                            onQrCodeChange={(data) => setSelectedQrCode(data)}
                                            onStage={() => setStage("process")}
                                            defectTypes={defectTypes}
                                        />
                                    </div>

                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {/* Order Information & Metrics */}
                <div className="grid grid-cols-4 gap-4">
                    {/* Image Preview */}
                    {type !== 'packing' && (
                        <ImagePreviewCard data={selectedRequest?.image_preview} />
                    )}

                    {/* Order Information */}
                    {type !== 'packing' && (
                        <OrderInfoCard data={selectedRequest?.order_info} />
                    )}

                    {/* Man Power */}
                    {type !== 'packing' && (
                        <ManPowerCard data={selectedRequest?.man_power} />
                    )}

                    {/* Defect Type */}
                    {type !== 'packing' && (
                        <DefectTypeCard
                            data={{
                                ...defectData,
                                ...(selectedRequest?.defect_summary || {}),
                            }}
                            types={defectTypes}
                            loading={loading}
                        />
                    )}

                    {/* Image Preview */}
                    {type === 'packing' && (
                        <ImagePreviewCard data={imagePreview} />
                    )}

                    {/* Information */}
                    {type === 'packing' && (
                        <InformationCard data={qrPackingData} />
                    )}

                    {/* Qr Code */}
                    {type === 'packing' && (
                        <QRScanCard count={count} onScan={handlePackingScan} />
                    )}
                </div>

                {/* Production Data Table */}
                {type !== 'packing' && (
                    <ProductionDataCard data={selectedRequest?.production_data} />
                )}

                {type === 'packing' && (
                    <ProductionDataCard data={productionData} />
                )}
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
