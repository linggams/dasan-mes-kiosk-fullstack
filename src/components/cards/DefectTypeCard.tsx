import { Card, CardContent } from "@/components/ui/card";

type Props = {
    data: Record<string, number>;
    types: { key: string; label: string }[];
    loading: boolean;
};

export default function DefectTypeCard({ data, types, loading }: Props) {
    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-32 h-6 bg-gray-300 rounded" />
                            <div className="w-16 h-8 bg-gray-300 rounded" />
                        </div>

                        <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200 space-y-3">
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
                            <h3 className="text-2xl font-bold text-gray-800">Defect</h3>
                            <span className="text-3xl font-bold text-blue-600">
                {data?.total_defect ?? 0}
              </span>
                        </div>

                        <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200 max-h-[32rem] overflow-y-auto">
                            <div className="space-y-2">
                                {Array.isArray(types) &&
                                    types
                                        .filter((type) => type.key !== "total_defect")
                                        .sort((a, b) => (data?.[b.key] ?? 0) - (data?.[a.key] ?? 0))
                                        .map((type) => (
                                            <div
                                                key={type.key}
                                                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100"
                                            >
                                                <span className="text-gray-700 font-medium">
                                                  {type.label}
                                                </span>
                                                <span className="text-2xl font-bold text-gray-800">
                                                  {data?.[type.key] ?? 0}
                                                </span>
                                            </div>
                                        ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
