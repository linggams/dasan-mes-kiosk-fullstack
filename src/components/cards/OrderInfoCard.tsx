import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type OrderInfo = {
    target: number;
    inspect: number;
    pass: number;
    cncm: number;
    defect_percentage: number;
    balance: number;
    progress_percentage: number;
};

type Props = {
    data?: OrderInfo;
};

export default function OrderInfoCard({ data }: Props) {
    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                <h3 className="text-2xl font-bold mb-6">Order Information</h3>
                <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-gray-500">Target</p>
                            <p className="text-xl font-bold">{data?.target || 0}</p>
                            <p className="text-sm text-gray-500">Total target for today</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Inspect</p>
                            <p className="text-xl font-bold">{data?.inspect || 0}</p>
                            <p className="text-sm text-gray-500">Total inspected pieces</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Pass</p>
                            <p className="text-xl font-bold">{data?.pass || 0}</p>
                            <p className="text-sm text-gray-500">Passed quality check</p>
                        </div>
                        <div>
                            <p className="text-base text-gray-500">CNCM</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{data?.cncm || 0}</p>
                            <p className="text-sm text-gray-500">Cannot be corrected/modified</p>
                        </div>
                        <div>
                            <p className="text-base text-gray-500">Balance</p>
                            <p
                                className={`text-xl font-bold mt-1 ${
                                    data?.balance !== undefined && data.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {data?.balance ?? 0}
                            </p>
                            <p className="text-sm text-gray-500">Remaining target</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Defect Percentage</p>
                            <p className="text-xl font-bold">{data?.defect_percentage || 0}%</p>
                            <p className="text-sm text-gray-500">Total defect rate</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-2">Progress</p>
                            <Progress value={data?.progress_percentage || 0} className="h-3"/>
                            <p className="text-lg font-bold">{data?.progress_percentage || 0}%</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}