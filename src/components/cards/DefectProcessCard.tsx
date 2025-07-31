import { Card, CardContent } from "@/components/ui/card";

type Props = {
    data: {
        total_defect: number;
        processes: { name: string; defect_count: number }[];
    };
    loading: boolean;
};

export default function DefectProcessCard({ data, loading }: Props) {
    return (
        <Card className="bg-white rounded-xl border-gray-200">
            <CardContent>
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-40 h-6 bg-gray-300 rounded" />
                            <div className="w-16 h-8 bg-gray-300 rounded" />
                        </div>
                        <div className="bg-white/80 p-6 rounded-xl border border-gray-200 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                    <div className="w-24 h-4 bg-gray-200 rounded" />
                                    <div className="w-10 h-6 bg-gray-300 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Defect Process
                            </h3>
                            <span className="text-3xl font-bold text-rose-600">
                                {data?.total_defect ?? 0}
                            </span>
                        </div>

                        <div className="mt-6 max-h-120 overflow-y-auto pr-1">
                            {data?.processes
                                ?.sort(
                                    (a, b) => b.defect_count - a.defect_count
                                )
                                ?.map((process, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                        <span className="text-gray-700 font-medium">
                                            {process.name}
                                        </span>
                                        <span className="text-2xl font-bold text-gray-800">
                                            {process.defect_count}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
