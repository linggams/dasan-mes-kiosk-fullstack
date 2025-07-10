"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import LineDataCard from "@/components/cards/LineDataCard";
import { useRequestLines } from "@/hooks/useRequestLines";

export default function LinePage() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

  const { isLoading, selectedRequestLines } = useRequestLines(baseUrl);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between w-full p-4 bg-white shadow">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <input
            type="date"
            className="px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded-md"
            value={selectedDate}
            onChange={handleDateChange}
          />

          <Button
            variant="outline"
            // onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
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
          ) : selectedRequestLines.length > 0 ? (
            selectedRequestLines.map((lines, idx: number) => (
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
