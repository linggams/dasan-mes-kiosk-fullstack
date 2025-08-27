"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    searchKey?: string;
    searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
    table,
    searchKey,
    searchPlaceholder = "Filter...",
}: DataTableToolbarProps<TData>) {
    const data = table.getRowModel().rows.map((row) => row.original);

    const handleExport = () => {
        if (!data || data.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, "data-table-export.xlsx");
    };

    return (
        <div className="flex items-center py-4 w-full">
            {data.length > 0 && (
                <Button
                    variant="outline"
                    className="mr-2"
                    onClick={handleExport}
                >
                    Export
                </Button>
            )}

            {searchKey && (
                <Input
                    placeholder={searchPlaceholder}
                    value={
                        (table
                            .getColumn(searchKey)
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn(searchKey)
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
