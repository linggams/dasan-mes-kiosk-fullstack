"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

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
import {RequestData, ProductionData, RequestFormData} from "@/types/request";
import { OrderInfo } from "@/types/order";
import { ManPower } from "@/types/order";
import { DefectSummary } from "@/types/defect";
import RequestModal from "@/components/modal/RequestModal";
import FactoryPacking from "@/components/FactoryPacking";
import QRScanCard from "@/components/cards/QrScanCard";
import InformationCard from "@/components/cards/InformationCard";
import { QRData } from "@/types/qr";

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

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [buyers, setBuyers] = useState<{ id: number; name: string }[]>([]);
    const [styles, setStyles] = useState<{ id: number; style: string }[]>([]);
    const [supervisors, setSupervisors] = useState<{ id: number; name: string }[]>([]);
    const [refetchSignal, setRefetchSignal] = useState(false);
    const [formData, setFormData] = useState<RequestFormData>({
        buyer_id: undefined,
        order_id: undefined,
        line_id: undefined,
        supervisor_id: undefined,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
    const [stage, setStage] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<{
        request_info: RequestData;
        image_preview: string;
        order_info: OrderInfo;
        man_power: ManPower;
        defect_summary: DefectSummary;
        production_data: ProductionData;
    } | null>(null);

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
    useEffect(() => {
        fetch(`${baseUrl}/kiosk/master/buyers`)
            .then((response) => response.json())
            .then((data) => setBuyers(data.data))
            .catch((error) => toast.error("Error fetching buyers:", error));

        fetch(`${baseUrl}/kiosk/master/styles`)
            .then((response) => response.json())
            .then((data) => setStyles(data.data))
            .catch((error) => toast.error("Error fetching styles:", error));

        fetch(`${baseUrl}/kiosk/master/supervisors`)
            .then((response) => response.json())
            .then((data) => setSupervisors(data.data))
            .catch((error) => toast.error("Error fetching supervisors:", error));
    }, [baseUrl]);

    const defaultFormData = {
        buyer_id: undefined,
        order_id: undefined,
        supervisor_id: undefined,
    };

    const handleOpenRequestModal = () => {
        setFormData(defaultFormData);
        setIsRequestModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch(`${baseUrl}/kiosk/sewing?line=${line}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            mode: "cors",
        })
            .then((res) => res.json())
            .then(() => {
                toast.success("Request created successfully");
                setIsRequestModalOpen(false);
                setRefetchSignal((prev) => !prev);
                setFormData(defaultFormData);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    /**
     * Sewing: Fetch Request Detail
     */
    const fetchRequestDetail = (reqId: number) => {
        setSelectedRequestId(reqId);

        fetch(`${baseUrl}/kiosk/sewing/${reqId}?line=${line}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "error") {
                    toast.info(result.errors);
                    setSelectedRequest(null);
                    return;
                }
                setSelectedRequest(result.data);
            })
            .catch((error) => toast.error(error.message));
    };

    /**
     * Sewing: Update Stage Request Item
     */
    const updateStage = async (stage: string) => {
        if (!selectedQrCode || !selectedRequestId) {
            toast.error("Please scan the QR code first!");
            return;
        }

        try {
            const res = await fetch(`${baseUrl}/kiosk/sewing/stage?line=${line}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    request_id: selectedRequestId,
                    qr_code: selectedQrCode,
                    stage: stage
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.errors);

            toast.success("Stage updated!");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
        }
    };

    /**
     * Packing: Scan Qr Code
     */
    const [count, setCount] = useState(0);
    const [qrPackingData, setQrPackingData] = useState<QRData | undefined>();
    const [imagePreview, setImagePreview] = useState("");
    const [productionData, setProductionData] = useState<ProductionData | undefined>();

    const handlePackingScan = async (qrCode: string) => {
        if (!qrCode.trim()) return;

        try {
            const res = await fetch(`${baseUrl}/kiosk/packing/scan?packing=${packing}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    qr_code: qrCode.trim(),
                }),
            });

            const result = await res.json();
            if (!res.ok) {
                const errorMsg = Array.isArray(result.errors)
                    ? result.errors.join(", ")
                    : result.errors || "Unknown error";
                toast.warning(errorMsg);
                return;
            }

            const data = result.data.qrData;
            const imagePreview = result.data.imagePreview;
            const counting = result.data.counting;
            const productionData = result.data.productionData;

            const scannedData: QRData = {
                buyer: data.buyer_name,
                style: data.style,
                size: data.size,
                color: data.color,
                purchaseOrder: data.purchase_order,
                destination: data.destination,
                qrNumber: data.qr_number,
            };

            setImagePreview(imagePreview);
            setQrPackingData(scannedData);
            setProductionData(productionData);
            setCount(counting);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
        }
    };


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
                        <DefectTypeCard data={selectedRequest?.defect_summary} />
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
