import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import YouTube from "react-youtube";
import { ProcessLayout } from "@/types/request";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ProcessLayoutCardProps {
    data: ProcessLayout[];
}

export default function ProcessLayoutCard({ data }: ProcessLayoutCardProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (url: string) => {
        setVideoUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setVideoUrl(null);
        setIsModalOpen(false);
    };

    const getYoutubeId = (url: string) => {
        const match = url.match(/(?:\?v=|\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    if (!data || data.length === 0) {
        return (
            <p className="p-4 text-gray-500">
                No process layout data available.
            </p>
        );
    }

    return (
        <>
            <Card className="mt-4">
                <CardContent className="p-0">
                    <div className="h-[calc(100vh-300px)] overflow-y-auto">
                        {/* <table className="min-w-[1000px] w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-3 py-2 border border-gray-300">
                                    No
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Process
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Machine Type
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Class
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Tooling
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Standard Time
                                </th>
                                <th className="px-3 py-2 border border-gray-300 text-center">
                                    Video
                                </th>
                                <th className="px-3 py-2 border border-gray-300">
                                    Man Power
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {data.map((row) => (
                                <tr
                                    key={row.no}
                                    className="bg-white hover:bg-gray-50 transition"
                                    style={{
                                        backgroundColor:
                                            row.highlight || "white",
                                    }}
                                >
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.no}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.process}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.machineType}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.classType}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.tooling}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.standardTime}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300 text-center">
                                        {row.video ? (
                                            <button
                                                onClick={() =>
                                                    row.video &&
                                                    openModal(row.video)
                                                }
                                                className="text-red-500 hover:text-red-600"
                                                title="Watch video"
                                            >
                                                <Youtube className="w-5 h-5 mx-auto" />
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-3 py-2 border border-gray-300">
                                        {row.manPower}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center text-xl font-semibold">
                                        No
                                    </TableHead>
                                    <TableHead className="text-left text-xl font-semibold">
                                        Process
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Machine Type
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Class
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Tooling
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Standard Time
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Actual Time (Second)
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Video
                                    </TableHead>
                                    <TableHead className="text-center text-xl font-semibold">
                                        Man Power
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow
                                        key={row.no}
                                        className={
                                            row.highlight ? "bg-yellow-50" : ""
                                        }
                                    >
                                        <TableCell className="text-center font-medium text-lg">
                                            {row.no}
                                        </TableCell>
                                        <TableCell className="text-left text-lg">
                                            {row.process}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.machineType}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.classType}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.tooling}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.standardTime}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.actualTime ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.video ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-2 h-10 w-10"
                                                    onClick={() =>
                                                        openModal(
                                                            row.video ?? "-"
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polygon points="5,3 19,12 5,21"></polygon>
                                                    </svg>
                                                </Button>
                                            ) : (
                                                <span className="text-lg">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-lg">
                                            {row.manPower}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="p-0 z-[9999] bg-white w-auto max-w-none h-auto max-h-none m-auto">
                    {videoUrl && (
                        <div className="aspect-video w-[900px]">
                            <YouTube
                                videoId={getYoutubeId(videoUrl) ?? ""}
                                className="w-full h-full"
                                opts={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
