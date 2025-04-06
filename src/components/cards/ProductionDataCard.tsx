import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    data: {
        actual: number[];
        cumulative: number[];
    };
};

export default function ProductionData({ data }: Props) {

    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                <div className="bg-white/80 p-3 rounded-xl backdrop-blur-sm border border-gray-200 overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="text-xs text-gray-700 bg-gray-50">
                            <th className="py-1.5 px-2 text-left">Time</th>
                            {[...Array(24).keys()].map((i) => (
                                <th key={i} className="py-1.5 px-2 text-center">
                                    {`${i.toString().padStart(2, "0")}:00`}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="text-xs border-t">
                            <td className="py-1.5 px-2 font-medium text-gray-700">Actual</td>
                            {data.actual.map((val, idx) => (
                                <td key={idx} className="py-1.5 px-2 text-center">{val}</td>
                            ))}
                        </tr>
                        <tr className="text-xs border-t">
                            <td className="py-1.5 px-2 font-medium text-gray-700">Cumulative</td>
                            {data.cumulative.map((val, idx) => (
                                <td key={idx} className="py-1.5 px-2 text-center">{val}</td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
