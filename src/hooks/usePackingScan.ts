import { useState } from "react";
import { toast } from "sonner";
import { QRData } from "@/types/qr";
import {ProductionData} from "@/types/request";

type UsePackingScanProps = {
    baseUrl: string;
    packing: string;
};

export const usePackingScan = ({ baseUrl, packing }: UsePackingScanProps) => {
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

    return {
        count,
        qrPackingData,
        imagePreview,
        productionData,
        handlePackingScan,
    };
};
