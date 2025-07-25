"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layouts/header";
import ImagePreviewCard from "@/components/cards/ImagePreviewCard";
import InformationCard from "@/components/cards/InformationCard";
import QRScanCard from "@/components/cards/QrScanCard";
import ProductionDataCard from "@/components/cards/ProductionDataCard";

import { usePackingScan } from "@/hooks/usePackingScan";

export default function PackingPage() {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

    const [packing, setPacking] = useState("1");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const packingParam = params.get("packing") ?? "1";
        setPacking(packingParam);
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

    const {
        count,
        qrPackingData,
        imagePreview,
        productionData,
        handlePackingScan,
    } = usePackingScan({ baseUrl, packing });

    return (
        <div className="min-h-screen p-6 bg-gray-100 space-y-6 select-none">
            <Header
                type="packing"
                date={date}
                time={time}
                toggleSidebar={() => {}}
            />

            <div className="grid grid-cols-4 gap-4">
                <ImagePreviewCard data={imagePreview} />
                <InformationCard data={qrPackingData} />
                <QRScanCard count={count} onScan={handlePackingScan} />
            </div>
            <ProductionDataCard data={productionData} />
        </div>
    );
}
