import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { RequestLinesTypes } from "@/hooks/useRequestLines";

type Props = {
  data: RequestLinesTypes;
};

export default function LineDataCard({ data }: Props) {
  const { line_info, order_info, production_data } = data;

  return (
    <Card className="bg-white border-none shadow-md rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardDescription className="text-base">
          {line_info.request_id} <b>{line_info.line}</b>
        </CardDescription>
        <CardAction className="flex gap-4 text-sm">
          <p>
            Request ID: <b>{line_info.request_id}</b>
          </p>
          <p>
            Buyer: <b>{line_info.buyer}</b>
          </p>
          <p>
            Style: <b>{line_info.style}</b>
          </p>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-3 sm:grid-cols-6 lg:grid-cols-8">
          <div>
            <Label className="text-sm text-gray-400">Target</Label>
            <p className="text-base font-semibold">{order_info.target}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Inspect</Label>
            <p className="text-base font-semibold">{order_info.inspect}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Pass</Label>
            <p className="text-base font-semibold">{order_info.pass}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">CNCM</Label>
            <p className="text-base font-semibold">{order_info.cncm}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Balance</Label>
            <p className="text-base font-semibold text-red-600">
              {order_info.balance}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Defect Percentage</Label>
            <p className="text-base font-semibold">
              {order_info.defect_percentage}%
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Man Power</Label>
            <p className="text-base font-semibold">{order_info.man_power}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-400">Defect</Label>
            <p className="text-base font-semibold">{order_info.defect}</p>
          </div>
        </div>
        <div className="w-full mb-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-400">Progress</Label>
            <p className="text-base font-semibold">
              {order_info.progress_percentage}%
            </p>
          </div>
          <Progress value={order_info.progress_percentage} />
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
                {production_data?.actual.map((val, idx) => (
                  <td key={idx} className="py-1.5 px-2 text-center">
                    {val}
                  </td>
                ))}
              </tr>
              <tr className="text-xs border-t">
                <td className="py-1.5 px-2 font-medium text-gray-700">
                  Cumulative
                </td>
                {production_data?.cumulative.map((val, idx) => (
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
