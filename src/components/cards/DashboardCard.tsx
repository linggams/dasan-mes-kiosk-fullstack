"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "@/components/ui/pie-chart";
import { cn } from "@/lib/utils";

interface OrderInfo {
    progress_percentage: number;
    loading: number;
    working: number;
    target: number;
    inspect: number;
    pass: number;
    balance: number;
    cncm: number;
    defect_percentage: number;
}

interface RequestData {
    image_preview?: string;
    order_info: OrderInfo;
}

interface DashboardGridProps {
    selectedRequest?: RequestData | null;
}

export default function DashboardCard({ selectedRequest }: DashboardGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Left Column */}
            <div className="grid grid-cols-1 gap-4 md:col-span-1">
                {/* Product Photo */}
                <Card className="flex items-center justify-center">
                    <CardContent className="p-6 w-full h-full flex items-center justify-center">
                        <div className="flex justify-center">
                            <div className="bg-gray-100 rounded-md w-[250px] h-[300px] flex items-center justify-center overflow-hidden">
                                <Image
                                    src={
                                        selectedRequest?.image_preview ||
                                        "/dress.svg"
                                    }
                                    width={500}
                                    height={300}
                                    alt="Product Image"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        target.nextElementSibling?.classList.remove(
                                            "hidden"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Chart */}
                <Card className="flex items-center justify-center">
                    <CardContent className="p-6 w-full h-full flex flex-col items-center justify-center">
                        <div className="relative flex flex-col items-center">
                            <PieChart
                                data={[
                                    {
                                        name: "Progress",
                                        value:
                                            selectedRequest?.order_info
                                                .progress_percentage || 0,
                                        color: "#3b82f6",
                                    },
                                    {
                                        name: "Remaining",
                                        value:
                                            100 -
                                            (selectedRequest?.order_info
                                                .progress_percentage || 0),
                                        color: "#e5e7eb",
                                    },
                                ]}
                                size={250}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="text-5xl font-bold text-blue-600">
                                    {selectedRequest?.order_info
                                        .progress_percentage ?? 0}
                                    %
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="grid grid-cols-1 gap-1 md:col-span-4">
                {/* Loading | Working */}
                <div className="grid grid-cols-2 gap-1 m-0.5">
                    <MetricCard
                        title="Loading"
                        value={selectedRequest?.order_info.loading}
                    />
                    <MetricCard
                        title="Working"
                        value={selectedRequest?.order_info.working}
                    />
                </div>

                {/* Target | Inspect | Pass */}
                <div className="grid grid-cols-3 gap-1 m-0.5">
                    <MetricCard
                        title="Target"
                        value={selectedRequest?.order_info.target}
                    />
                    <MetricCard
                        title="Inspect"
                        value={selectedRequest?.order_info.inspect}
                    />
                    <MetricCard
                        title="Pass"
                        value={selectedRequest?.order_info.pass}
                    />
                </div>

                {/* Balance | CNCM | Defect Percentage */}
                <div className="grid grid-cols-3 gap-1 m-0.5">
                    <MetricCard
                        title="Balance"
                        value={selectedRequest?.order_info.balance}
                        highlight="red"
                    />
                    <MetricCard
                        title="CNCM"
                        value={selectedRequest?.order_info.cncm}
                    />
                    <MetricCard
                        title="Defect Percentage"
                        value={selectedRequest?.order_info.defect_percentage}
                        suffix="%"
                    />
                </div>
            </div>
        </div>
    );
}

/* Reusable Metric Card */
function MetricCard({
    title,
    value,
    suffix,
    highlight,
}: {
    title: string;
    value?: number;
    suffix?: string;
    highlight?: "red" | "blue" | "green";
}) {
    return (
        <Card className="m-0.5">
            <CardContent className="flex flex-col gap-1 p-3">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black">
                    {title}
                </p>
                <p
                    className={cn(
                        "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold",
                        highlight === "red"
                            ? "text-red-500"
                            : highlight === "blue"
                            ? "text-blue-500"
                            : highlight === "green"
                            ? "text-green-500"
                            : "text-black"
                    )}
                >
                    {value?.toLocaleString("en-US") ?? "-"}
                    {suffix}
                </p>
            </CardContent>
        </Card>
    );
}
