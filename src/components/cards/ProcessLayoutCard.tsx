import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
        // setVideoUrl(null);
        setIsModalOpen(false);
    };

    const getYoutubeId = (url: string) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes("youtu.be")) {
                return parsed.pathname.slice(1);
            }
            if (parsed.hostname.includes("youtube.com")) {
                return parsed.searchParams.get("v");
            }
            return null;
        } catch {
            return null;
        }
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
                                        style={{
                                            backgroundColor: row.highlight
                                                ? `${row.highlight}40`
                                                : "transparent",
                                            borderLeft: row.highlight
                                                ? `6px solid ${row.highlight}`
                                                : undefined,
                                        }}
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

            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) setVideoUrl(null);
                }}
            >
                <DialogContent className="p-0 z-[9999] bg-white w-auto max-w-none h-auto max-h-none m-auto">
                    <VisuallyHidden>
                        <DialogTitle>Process Video</DialogTitle>
                    </VisuallyHidden>
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
