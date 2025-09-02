"use client";

import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    size?: number;
    showLabel?: boolean;
}

export function PieChart({ data, size = 200 }: PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={size}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={size * 0.3}
                    outerRadius={size * 0.4}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
