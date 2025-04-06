import { Card, CardContent } from "@/components/ui/card";
import { DefectSummary } from "@/types/defect";

type Props = {
    data?: DefectSummary;
};

export default function DefectTypeCard({ data }: Props) {
    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Defect</h3>
                    <span className="text-3xl font-bold text-blue-600">{data?.total_defect || 0}</span>
                </div>
                <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Skip Stitch</span>
                            <span className="text-2xl font-bold text-gray-800">{data?.skip_stitch || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Broken Stitch</span>
                            <span className="text-2xl font-bold text-gray-800">{data?.broken_stitch || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Puckering</span>
                            <span className="text-2xl font-bold text-gray-800">{data?.puckering || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Measurement</span>
                            <span className="text-2xl font-bold text-gray-800">{data?.measurement || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Seam</span>
                            <span className="text-2xl font-bold text-gray-800">{data?.seam || 0}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
