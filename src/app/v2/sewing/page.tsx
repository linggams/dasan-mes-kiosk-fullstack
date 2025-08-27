"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PieChart } from "@/components/ui/pie-chart";
import { Search } from "lucide-react";
import { toast } from "sonner";
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

function QrFlowDialog({
    open,
    onOpenChange,
    qrValue,
    setQrValue,
    setSelectedRequest,
    processLayoutData,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    qrValue: string;
    setQrValue: (value: string) => void;
    setSelectedRequest: Dispatch<SetStateAction<Request>>;
    processLayoutData: Process[];
}) {
    const [step, setStep] = useState(1);
    const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
    const [defectProcessMapping, setDefectProcessMapping] = useState<{
        [key: string]: number[];
    }>({});

    const defectTypes = [
        "Broken stitch",
        "Open seam",
        "Puckering",
        "Slanted",
        "Un-balance",
        "Uneven",
        "Pleated",
        "Poor Shape",
    ];

    const resetAndClose = () => {
        setStep(1);
        setSelectedDefects([]);
        setDefectProcessMapping({});
        setQrValue("");
        onOpenChange(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetAndClose();
        }
        onOpenChange(isOpen);
    };

    const handlePass = () => {
        setSelectedRequest((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                pass: prev.details.pass + 1,
                inspect: prev.details.inspect + 1,
            },
        }));
        resetAndClose();
    };

    const handleCncm = () => {
        setSelectedRequest((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                cncm: prev.details.cncm + 1,
                inspect: prev.details.inspect + 1,
            },
        }));
        resetAndClose();
    };

    const handleRework = () => {
        setSelectedRequest((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                inspect: prev.details.inspect + 1,
            },
        }));
        resetAndClose();
    };

    const handleDefectChange = (defect: string) => {
        setSelectedDefects((prev) =>
            prev.includes(defect)
                ? prev.filter((d) => d !== defect)
                : [...prev, defect]
        );
    };

    const handleProcessChange = (
        defect: string,
        selectedProcesses: string[]
    ) => {
        setDefectProcessMapping((prev) => ({
            ...prev,
            [defect]: selectedProcesses.map((p) => parseInt(p, 10)),
        }));
    };

    const allProcessesSelected =
        Object.keys(defectProcessMapping).length > 0 &&
        Object.values(defectProcessMapping).every(
            (processes) => processes.length > 0
        );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Step {step}</DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handlePass();
                            }
                        }}
                    >
                        <div className="grid gap-2 py-4">
                            <p>
                                <span className="font-semibold">Buyer :</span>{" "}
                                GAP
                            </p>
                            <p>
                                <span className="font-semibold">Style :</span>{" "}
                                145644
                            </p>
                            <p>
                                <span className="font-semibold">Size :</span> M
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Purchase Order :
                                </span>{" "}
                                PO978697
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Destination :
                                </span>{" "}
                                Canada
                            </p>
                            <p>
                                <span className="font-semibold">
                                    QR Number :
                                </span>{" "}
                                {qrValue}
                            </p>
                        </div>
                        <DialogFooter className="gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setStep(2)}
                            >
                                Fail
                            </Button>
                            <Button type="button" onClick={handlePass}>
                                Pass (Enter)
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="grid gap-4 py-4">
                            {defectTypes.map((defect) => (
                                <div
                                    key={defect}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={defect}
                                        checked={selectedDefects.includes(
                                            defect
                                        )}
                                        onCheckedChange={() =>
                                            handleDefectChange(defect)
                                        }
                                    />
                                    <label
                                        htmlFor={defect}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {defect}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="sm:justify-between gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    const initialMapping =
                                        selectedDefects.reduce(
                                            (acc, defect) => {
                                                acc[defect] = [];
                                                return acc;
                                            },
                                            {} as { [key: string]: number[] }
                                        );
                                    setDefectProcessMapping(initialMapping);
                                    setStep(3);
                                }}
                                disabled={selectedDefects.length === 0}
                            >
                                Next
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto pr-4">
                            <p className="text-sm text-muted-foreground">
                                For each defect selected, please assign the
                                processes where it occurred.
                            </p>
                            {Object.keys(defectProcessMapping).map((defect) => (
                                <div
                                    key={defect}
                                    className="grid grid-cols-3 items-center gap-4"
                                >
                                    <Label
                                        htmlFor={`process-${defect}`}
                                        className="text-right"
                                    >
                                        {defect}
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedValues =
                                                defectProcessMapping[defect] ||
                                                [];
                                            if (
                                                !selectedValues.includes(
                                                    parseInt(value, 10)
                                                )
                                            ) {
                                                handleProcessChange(defect, [
                                                    ...selectedValues.map(
                                                        String
                                                    ),
                                                    value,
                                                ]);
                                            }
                                        }}
                                    >
                                        <SelectTrigger
                                            id={`process-${defect}`}
                                            className="col-span-2"
                                        >
                                            <SelectValue placeholder="Select processes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {processLayoutData.map(
                                                (process) => (
                                                    <SelectItem
                                                        key={process.no}
                                                        value={String(
                                                            process.no
                                                        )}
                                                    >
                                                        {process.process} -{" "}
                                                        {process.manPower}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <div className="col-span-2 col-start-2">
                                        {defectProcessMapping[defect]?.map(
                                            (processNo) => {
                                                const process =
                                                    processLayoutData.find(
                                                        (p) =>
                                                            p.no === processNo
                                                    );
                                                return process ? (
                                                    <Badge
                                                        key={processNo}
                                                        variant="secondary"
                                                        className="mr-2 mb-2"
                                                        onClick={() => {
                                                            handleProcessChange(
                                                                defect,
                                                                defectProcessMapping[
                                                                    defect
                                                                ]
                                                                    .filter(
                                                                        (p) =>
                                                                            p !==
                                                                            processNo
                                                                    )
                                                                    .map(String)
                                                            );
                                                        }}
                                                    >
                                                        {process.process} -{" "}
                                                        {process.manPower}
                                                        <button className="ml-1 hover:text-destructive">
                                                            ×
                                                        </button>
                                                    </Badge>
                                                ) : null;
                                            }
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="justify-between mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(2)}
                            >
                                Back
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleCncm}
                                    disabled={!allProcessesSelected}
                                >
                                    CNCM
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleRework}
                                    disabled={!allProcessesSelected}
                                >
                                    Rework
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default function Dashboard() {
    const [tabs, setTabs] = useState<
        Array<{ id: string; buyer: string; style: string; request: Request }>
    >([]);

    const defaultFormData = {
        buyer_id: undefined,
        cutting_id: undefined,
        supervisor_id: undefined,
    };

    const [line, setLine] = useState("1");
    const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
    const [stage, setStage] = useState("");

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
    const [activeTab, setActiveTab] = useState<string>(() =>
        requests.length > 0 ? requests[0].id.toString() : ""
    );

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

    const [videoOpen, setVideoOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<{
        process: string;
        no: number;
    } | null>(null);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [qrInputValue, setQrInputValue] = useState("");
    const [selectedSOPData, setSelectedSOPData] = useState<SOP | null>(null);
    const [sopViewDialogOpen, setSopViewDialogOpen] = useState(false);
    const qrInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, []);
    useEffect(() => {
        const handleGlobalKeyDown = () => {
            if (!qrDialogOpen && qrInputRef.current) {
                qrInputRef.current.focus();
            }
        };
        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, [qrDialogOpen]);

    const getHighlightStyle = (highlight?: string) => {
        if (!highlight) return {};

        const highlightColors = {
            yellow: "bg-yellow-100",
            red: "bg-red-100",
            green: "bg-green-100",
            black: "bg-gray-100",
        };

        return {
            className:
                highlightColors[highlight as keyof typeof highlightColors] ||
                "",
        };
    };

    return (
        <div
            className="flex min-h-screen flex-col select-none"
            style={{
                touchAction: "none",
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
                                                    selectedRequest?.sop_data
                                                }
                                                onSelect={(sop) => {
                                                    setSelectedSOPData(sop);
                                                    setSopViewDialogOpen(true);
                                                }}
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

                {/* Video Dialog */}
                <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                    <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>
                                Process Video - Step {selectedVideo?.no}:{" "}
                                {selectedVideo?.process}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/vbao4f7oyKw?start=3"
                                title={`Process Video - ${selectedVideo?.process}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* <QrFlowDialog
                    open={qrDialogOpen}
                    onOpenChange={setQrDialogOpen}
                    qrValue={qrInputValue}
                    setQrValue={setQrInputValue}
                    setSelectedRequest={setSelectedRequest}
                    processLayoutData={processLayoutData}
                /> */}

                {/* SOP View Dialog */}
                <Dialog
                    open={sopViewDialogOpen}
                    onOpenChange={setSopViewDialogOpen}
                >
                    <DialogContent fullScreen>
                        <div className="flex flex-col h-full p-6">
                            <DialogHeader className="pb-4 border-b">
                                <DialogTitle className="text-2xl font-bold">
                                    {selectedSOPData?.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col flex-1">
                                <div className="flex-1 space-y-6 py-6">
                                    {/* Metadata Section */}
                                    <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created Date
                                            </label>
                                            <p className="text-sm font-medium mt-1">
                                                {selectedSOPData?.createdAt}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="text-sm font-medium mt-1">
                                                {selectedSOPData?.updatedAt}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            Content
                                        </label>
                                        <div className="h-[calc(100vh-400px)] overflow-y-auto p-4 bg-background border rounded-lg">
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                {selectedSOPData?.content ||
                                                    "No content available"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setSopViewDialogOpen(false)
                                        }
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
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
