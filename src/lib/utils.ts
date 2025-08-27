import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RequestLinesTypes } from "@/types/lines";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const exportToExcel = (data: RequestLinesTypes[]) => {
    if (!data || data.length === 0) return;

    const rows = data.map((item) => {
        const base = {
            Line: item.extra_data.line_group,
            RequestID: item.extra_data.code,
            Buyer: item.extra_data.buyer,
            Style: item.extra_data.style,
        };

        const hours: Record<string, number> = {};
        for (let i = 0; i < 24; i++) {
            const label = `${String(i).padStart(2, "0")}:00`;
            hours[label] = item.extra_data[
                `h${i}` as keyof typeof item.extra_data
            ] as number;
        }

        const sum = {
            Total: item.extra_data.total_produced,
            Target: item.extra_data.target,
        };

        return { ...base, ...hours, ...sum };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monitoring Lines");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const fileName = `Monitoring-Lines-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
    saveAs(
        new Blob([excelBuffer], { type: "application/octet-stream" }),
        fileName
    );
};
