import { Card, CardContent } from "@/components/ui/card";

type ManPower = {
    man_power: number;
    man_operator: number;
    helper: number;
    iron: number;
    qc: number;
    qc_finishing: number;
    hangtag: number;
    folding: number;
};

type Props = {
    data?: ManPower;
};

export default function ManPowerCard({ data }: Props) {
    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Man Power</h3>
                    <span className="text-3xl font-bold text-blue-600">{data?.man_power || 0}</span>
                </div>
                <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200">
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Operator</span>
                            <span className="text-2xl font-bold text-blue-500">{data?.man_operator || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Helper</span>
                            <span className="text-2xl font-bold text-red-500">{data?.helper || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Iron</span>
                            <span className="text-2xl font-bold text-purple-500">{data?.iron || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">QC</span>
                            <span className="text-2xl font-bold text-orange-500">{data?.qc || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">QC Finishing</span>
                            <span className="text-2xl font-bold text-orange-500">{data?.qc_finishing || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Hangtag</span>
                            <span className="text-2xl font-bold text-orange-500">{data?.hangtag || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-gray-700 font-medium">Folding</span>
                            <span className="text-2xl font-bold text-orange-500">{data?.folding || 0}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
