"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import LineDataCard from "@/components/cards/LineDataCard";
import { useRequestLines } from "@/hooks/useRequestLines";
import { FactoryTypes } from "@/types/request";
import { CalendarIcon, LoaderCircle, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function LinePage() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
  const [allFactories, setAllFactories] = useState<FactoryTypes[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());

  const { isLoading, selectedRequestLines } = useRequestLines(
    baseUrl,
    selectedFactory,
    currentDate
  );

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
              <SelectItem key={factory.id} value={JSON.stringify(factory)}>
                {factory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!currentDate}
                className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
              >
                <CalendarIcon />
                {currentDate ? (
                  format(currentDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="relative w-auto p-0 mr-[6.5rem] bg-gray-50">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={currentDate}
                onSelect={setCurrentDate}
              />
            </PopoverContent>
          </Popover>

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
              <LoaderCircle className="text-gray-500 size-8 animate-spin" />
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
