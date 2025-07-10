import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";

type Props = {
  data?: {
    actual: number[];
    cumulative: number[];
  };
};

export default function DummyData({ data }: Props) {
  return (
    <Card className="bg-white border-none shadow-md rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardDescription className="text-base">
          Factory 2 <b>Line C</b>
        </CardDescription>
        <CardAction className="flex gap-4 text-sm">
          <p>
            Request ID: <b>REQ000002</b>
          </p>
          <p>
            Buyer: <b>H&M</b>
          </p>
          <p>
            Style: <b>2756332</b>
          </p>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-3 sm:grid-cols-6 lg:grid-cols-8">
          <div>
            <Label className="text-sm text-gray-400">Target</Label>
            <p className="text-base font-semibold">432</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Impact</Label>
            <p className="text-base font-semibold">432</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Pass</Label>
            <p className="text-base font-semibold">432</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">CNCM</Label>
            <p className="text-base font-semibold">432</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Balance</Label>
            <p className="text-base font-semibold text-red-600">-1</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Defect Percentage</Label>
            <p className="text-base font-semibold">5%</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Man Power</Label>
            <p className="text-base font-semibold">26</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Defect</Label>
            <p className="text-base font-semibold">300</p>
          </div>
        </div>
        <div className="w-full mb-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400">Progress</Label>
            <p className="text-base font-semibold">33%</p>
          </div>
          <Progress value={33} />
        </div>
        <div className="overflow-x-auto border border-gray-200 bg-white/80 rounded-xl backdrop-blur-sm">
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
                <td className="py-1.5 px-2 font-medium text-gray-700">
                  Actual
                </td>
                {data?.actual.map((val, idx) => (
                  <td key={idx} className="py-1.5 px-2 text-center">
                    {val}
                  </td>
                ))}
              </tr>
              <tr className="text-xs border-t">
                <td className="py-1.5 px-2 font-medium text-gray-700">
                  Cumulative
                </td>
                {data?.cumulative.map((val, idx) => (
                  <td key={idx} className="py-1.5 px-2 text-center">
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
