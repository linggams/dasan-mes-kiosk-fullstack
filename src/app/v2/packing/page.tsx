"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { usePackingScan } from "@/hooks/usePackingScan";
import FactoryPacking from "@/components/FactoryPacking";
import RealtimeClock from "@/components/RealtimeClock";
import Image from "next/image";

export default function Dashboard() {
    const [packing, setPacking] = useState("1");
    const [qrInputValue, setQrInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const qrInputRef = useRef<HTMLInputElement>(null);

    // Get packing name via param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const packingParam = params.get("packing") ?? "1";
        setPacking(packingParam);
    }, []);

    // Auto focus QR input on page load
    useEffect(() => {
        if (qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, []);

    // Auto focus QR input on any keyboard input
    useEffect(() => {
        const handleGlobalKeyDown = () => {
            if (qrInputRef.current) {
                qrInputRef.current.focus();
            }
        };
        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, []);

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

    const { count, qrPackingData, imagePreview, handlePackingScan } =
        usePackingScan({
            packing: packing,
        });

    const onEnterQr = async (qrValue: string) => {
        const cleanQrValue = qrValue.trim().toUpperCase();
        if (!cleanQrValue) return;
        setIsProcessing(true);
        setErrorMessage("");

        try {
            await handlePackingScan(cleanQrValue);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Unknown error");
            }
        } finally {
            setQrInputValue("");
            setIsProcessing(false);
            qrInputRef.current?.focus();
        }
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
            {/* Header Section - Contains factory info, line info, current date/time, and QR scan */}
            <header className="flex items-center justify-between border-b px-4 py-2 bg-white">
                {/* Left side - Factory/Line information */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FactoryPacking />
                    </div>
                </div>
                {/* Right side - Current date/time and QR scan */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <RealtimeClock />
                    </div>

                    {/* QR Scan Input */}
                    <div className="relative">
                        <Input
                            ref={qrInputRef}
                            placeholder={
                                isProcessing ? "Processing..." : "Scan here..."
                            }
                            className={`pl-8 w-56 text-lg ${
                                isProcessing
                                    ? "bg-yellow-50 border-yellow-300"
                                    : ""
                            }`}
                            value={qrInputValue}
                            onChange={(e) => {
                                setQrInputValue(e.target.value);
                                // Clear error message when user starts typing
                                if (errorMessage) {
                                    setErrorMessage("");
                                }
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    qrInputValue &&
                                    !isProcessing
                                ) {
                                    e.preventDefault();
                                    onEnterQr(qrInputValue);
                                }
                            }}
                            disabled={isProcessing}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 ${
                                isProcessing
                                    ? "text-yellow-500 animate-pulse"
                                    : "text-gray-500"
                            }`}
                        >
                            <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                            ></rect>
                            <path d="M8 7v10"></path>
                            <path d="M12 7v10"></path>
                            <path d="M16 7v10"></path>
                        </svg>
                        {isProcessing && (
                            <div className="absolute -bottom-6 left-0 text-xs text-yellow-600 font-medium">
                                Processing QR Code...
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4">
                {isProcessing ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-blue-600 mb-2">
                                Processing QR Code...
                            </p>
                            <p className="text-sm text-gray-500">
                                Please wait a moment
                            </p>
                        </div>
                    </div>
                ) : errorMessage ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mx-auto text-red-400"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-red-600 mb-2">
                                QR Code Not Found
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                {errorMessage}
                            </p>
                            <p className="text-xs text-gray-500">
                                Please scan a valid QR code
                            </p>
                        </div>
                    </div>
                ) : qrPackingData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Product Image */}
                        <Card className="h-[500px]">
                            <CardContent className="flex items-center justify-center h-full p-4">
                                <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center overflow-hidden shadow-inner">
                                    <Image
                                        src={imagePreview || "/placeholder.svg"}
                                        className="w-full h-full object-contain p-2"
                                        alt="Product Image"
                                        width={500}
                                        height={300}
                                        onError={(e) => {
                                            const target =
                                                e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            target.nextElementSibling?.classList.remove(
                                                "hidden"
                                            );
                                        }}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="120"
                                        height="120"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-400 hidden"
                                    >
                                        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2: Item Information */}
                        <Card className="h-[500px]">
                            <CardContent className="flex flex-col justify-center h-full space-y-6 p-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Buyer:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.buyer}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Style:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.style}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Purchase Order:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.purchaseOrder}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Destination:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.destination}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Size:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.size}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">
                                        Color:
                                    </span>
                                    <span className="text-xl font-bold">
                                        {qrPackingData.color}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Count */}
                        <Card className="h-[500px]">
                            <CardContent className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-8xl font-bold text-blue-600 mb-4">
                                        {count}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-600">
                                        Total Items
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <div className="mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mx-auto text-gray-400"
                                >
                                    <rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="3"
                                        rx="2"
                                    ></rect>
                                    <path d="M8 7v10"></path>
                                    <path d="M12 7v10"></path>
                                    <path d="M16 7v10"></path>
                                </svg>
                            </div>
                            <p className="text-lg font-medium mb-2">
                                No item scanned
                            </p>
                            <p className="text-sm mb-4">
                                Scan QR code to view item details
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
