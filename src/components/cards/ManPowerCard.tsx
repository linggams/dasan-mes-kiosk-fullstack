import { Card, CardContent } from "@/components/ui/card";

type ManPowerItem = {
    class_name: string;
    total: number;
};

type Props = {
    data?: ManPowerItem[];
};

export default function ManPowerCard({ data }: Props) {
    const totalManPower = data?.reduce((sum, item) => sum + item.total, 0) || 0;

    return (
        <Card className="bg-white rounded-xl border-gray-200">
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Man Power
                    </h3>
                    <span className="text-3xl font-bold text-blue-600">
                        {totalManPower}
                    </span>
                </div>

                <div className="space-y-3 mt-6">
                    {data?.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <span className="text-gray-700 font-medium">
                                {item.class_name}
                            </span>
                            <span className="text-2xl font-bold text-blue-500">
                                {item.total}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
