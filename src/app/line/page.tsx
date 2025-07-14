"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import LineDataCard from "@/components/cards/LineDataCard";
import { useRequestLines } from "@/hooks/useRequestLines";
import { FactoryTypes } from "@/types/request";
import { RefreshCw } from "lucide-react";

export default function LinePage() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
  const [allFactories, setAllFactories] = useState<FactoryTypes[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  });
  const [selectedFactory, setSelectedFactory] = useState<string>("");

  const { isLoading, selectedRequestLines } = useRequestLines(baseUrl);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/kiosk/master/factories`);
        const result = await res.json();

        if (result.status === "error") {
          setAllFactories([]);
          return;
        }

        const data = result.data;

        setAllFactories(data);
      } catch (error: unknown) {
        console.log(error);
      }
    })();
  }, [baseUrl]);

  const filteredRequestLines = useMemo(() => {
    if (!selectedFactory || selectedFactory === "default") {
      return selectedRequestLines;
    }

    return selectedRequestLines.filter(
      (line) => line.line_info.factory === selectedFactory
    );
  }, [selectedFactory, selectedRequestLines]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between w-full p-4 bg-white shadow">
        <Select defaultValue="default" onValueChange={setSelectedFactory}>
          <SelectTrigger className="min-w-44">
            <SelectValue placeholder="Select Factory" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50">
            <SelectItem value="default" disabled>
              Select Factory
            </SelectItem>
            {allFactories.map((factory) => (
              <SelectItem key={factory.id} value={factory.name}>
                {factory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <input
            type="date"
            className="px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded-md"
            value={selectedDate}
            onChange={handleDateChange}
          />

          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw />
            Refresh
          </Button>
        </div>
      </nav>

      <section className="mx-auto mt-4 xl:max-w-[100rem] max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : filteredRequestLines.length > 0 ? (
            filteredRequestLines.map((lines, idx: number) => (
              <LineDataCard key={lines.line_info.line + idx} data={lines} />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No data available for the selected date.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
