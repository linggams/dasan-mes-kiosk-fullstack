import {QRData} from "@/types/qr";

type Props = {
    data?: QRData | null;
};

export default function InformationCard({ data }: Props) {
    return (
        <div className="col-span-1 md:col-span-2 bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-2">
                {[
                    { label: "Buyer", value: data?.buyer },
                    { label: "Style", value: data?.style },
                    { label: "Purchase Order", value: data?.purchaseOrder },
                    { label: "Destination", value: data?.destination },
                    { label: "Size", value: data?.size },
                    { label: "Color", value: data?.color },
                ].map((item, index) => (
                    <div className="space-y-2" key={index}>
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className="text-xl font-bold text-gray-800">{item.value || '-'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
