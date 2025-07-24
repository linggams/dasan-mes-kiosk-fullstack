import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import YouTube from "react-youtube";
import { ProcessLayout } from "@/types/request";

interface ProcessLayoutCardProps {
    data: ProcessLayout[];
}

export default function ProcessLayoutCard({ data }: ProcessLayoutCardProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(data)

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
            <Card className="bg-white rounded-xl border border-gray-300 shadow-sm">
                <CardContent className="overflow-auto p-4">
                    <table className="min-w-[1000px] w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
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
                    </table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent
                    className="w-full max-w-6xl h-[90vh] max-h-[90vh] z-[9999] bg-white overflow-hidden"
                    style={{ padding: 0 }}
                >
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Video Preview</DialogTitle>
                    </DialogHeader>
                    {videoUrl && (
                        <div className="aspect-video">
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
