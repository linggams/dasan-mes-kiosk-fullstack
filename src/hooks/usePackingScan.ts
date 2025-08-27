import { useState } from "react";
import { toast } from "sonner";
import { QRData } from "@/types/qr";
import { ProductionData } from "@/types/request";
import { kiosk } from "@/lib/axios";

type UsePackingScanProps = {
    packing: string;
};

export const usePackingScan = ({ packing }: UsePackingScanProps) => {
    const [count, setCount] = useState(0);
    const [qrPackingData, setQrPackingData] = useState<QRData | undefined>();
    const [imagePreview, setImagePreview] = useState("");
    const [productionData, setProductionData] = useState<
        ProductionData | undefined
    >();

    const handlePackingScan = async (qrCode: string) => {
        if (!qrCode.trim()) return;

        try {
            const result = await kiosk.post(
                `/packing/scan?packing=${packing}`,
                {
                    qr_code: qrCode.trim(),
                }
            );

            // if (!res.ok) {
            //     const errorMsg = Array.isArray(result.errors)
            //         ? result.errors.join(", ")
            //         : result.errors || "Unknown error";
            //     toast.warning(errorMsg);
            //     return;
            // }

            const { qrData, imagePreview, counting, productionData } =
                result.data;

            const scannedData: QRData = {
                buyer: qrData.buyer,
                style: qrData.style,
                size: qrData.size,
                color: qrData.color,
                purchaseOrder: qrData.purchase_order,
                destination: qrData.destination,
                qrNumber: qrData.qr_number,
            };

            setImagePreview(imagePreview);
            setQrPackingData(scannedData);
            setProductionData(productionData);
            setCount(counting);
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.errors ??
                err.message ??
                "Unknown error occurred";
            toast.error(
                Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg
            );
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
