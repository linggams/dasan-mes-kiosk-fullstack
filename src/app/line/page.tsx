"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { useUpdateStage } from "@/hooks/useUpdateStage";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import DummyData from "@/components/cards/DummyData";

export default function LinePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // if (onDateChange) {
    //     onDateChange(newDate);
    // }
  };
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;

  const [line, setLine] = useState("1");

  const { selectedRequestId, selectedRequest, fetchRequestDetail } =
    useRequestDetail(baseUrl, line);

  const { updateStage } = useUpdateStage({
    baseUrl,
    line,
    selectedQrCode,
    selectedRequestId,
  });

  const handleOpenRequestModal = () => {
    // setFormData(defaultFormData);
    // setIsRequestModalOpen(true);
  };

  const isToday = (dateStr: string) => {
    const requestDate = new Date(dateStr);
    const today = new Date();

    return (
      requestDate.getFullYear() === today.getFullYear() &&
      requestDate.getMonth() === today.getMonth() &&
      requestDate.getDate() === today.getDate()
    );
  };

  const dummy = {
    actual: [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
      170, 180, 190, 200, 210, 220, 230, 240,
    ],
    cumulative: [
      10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200,
      1360, 1530, 1710, 1900, 2100, 2310, 2530, 2760, 3000,
    ],
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
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="text-gray-500"
            />
            Refresh
          </Button>
        </div>
      </nav>

      <section className="mx-auto mt-4 xl:max-w-[100rem] max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map((line) => (
            <DummyData key={line} data={dummy} />
          ))}
        </div>
      </section>
    </div>
  );
}
