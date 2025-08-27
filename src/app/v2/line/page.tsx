"use client";

import { useState, useEffect } from "react";
import { RefreshCw, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FactoryTypes } from "@/types/request";
import { useRequestLines, RequestLinesTypes } from "@/hooks/useRequestLines";
import { master } from "@/lib/axios";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function MonitoringLine() {
    const [allFactories, setAllFactories] = useState<FactoryTypes[]>([]);
    const [selectedFactory, setSelectedFactory] = useState("");
    const [currentDate, setCurrentDate] = useState<Date | undefined>(
        new Date()
    );

    const { selectedRequestLines, isLoading } = useRequestLines(
        selectedFactory,
        new Date()
    );

    useEffect(() => {
        (async () => {
            try {
                const result = await master.get(`/factories`);
                setAllFactories(result.data);
            } catch (error: unknown) {
                console.error(error);
            }
        })();
    }, []);

    const linesData = selectedRequestLines;

    const hourColumns: ColumnDef<RequestLinesTypes>[] = Array.from(
        { length: 24 },
        (_, i) => {
            const label = `${String(i).padStart(2, "0")}:00`;
            return {
                accessorKey: `extra_data.h${i}`,
                header: label,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.extra_data[`h${i}`]}
                    </div>
                ),
            };
        }
    );

    const baseColumns: ColumnDef<RequestLinesTypes>[] = [
        {
            id: "line",
            accessorKey: "extra_data.line_group",
            header: "LINE",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.line_group}
                </div>
            ),
        },
        {
            accessorKey: "extra_data.code",
            header: "REQUEST ID",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.code}
                </div>
            ),
        },
        {
            accessorKey: "extra_data.buyer",
            header: "BUYER",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.buyer}
                </div>
            ),
        },
        {
            accessorKey: "extra_data.style",
            header: "STYLE",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.style}
                </div>
            ),
        },
    ];

    const sumColumns: ColumnDef<RequestLinesTypes>[] = [
        {
            accessorKey: "extra_data.total_produced",
            header: "TOTAL",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.total_produced}
                </div>
            ),
        },
        {
            accessorKey: "extra_data.target",
            header: "TARGET",
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.extra_data.target}
                </div>
            ),
        },
    ];

    const columns: ColumnDef<RequestLinesTypes>[] = [
        ...baseColumns,
        ...hourColumns,
        ...sumColumns,
    ];

    return (
        <div className="min-h-screen">
            {/* Page header */}
            <div className="bg-white border-b fixed top-0 left-0 right-0 z-10 shadow-sm">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Factory selector */}
                        <div>
                            <Select
                                defaultValue="default"
                                onValueChange={setSelectedFactory}
                            >
                                <SelectTrigger className="min-w-44">
                                    <SelectValue placeholder="Select Factory" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-50">
                                    <SelectItem value="default" disabled>
                                        Select Factory
                                    </SelectItem>
                                    {allFactories.map((factory) => (
                                        <SelectItem
                                            key={factory.id}
                                            value={JSON.stringify(factory)}
                                        >
                                            {factory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Refresh button */}
                        <div className="flex items-center gap-3">
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

                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content container */}
            <div className="px-4 pt-16 pb-6">
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={linesData}
                        searchKey="line"
                        searchPlaceholder="Search by line..."
                    />
                </div>
            </div>
        </div>
    );
}
