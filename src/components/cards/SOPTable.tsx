import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SOP = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string | null;
};

interface SOPTableProps {
    sopData: SOP[];
}

export default function SOPTable({ sopData }: SOPTableProps) {
    const [selectedSOPData, setSelectedSOPData] = useState<SOP | null>(null);
    const [sopViewDialogOpen, setSopViewDialogOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-full">Title</TableHead>
                            <TableHead className="whitespace-nowrap">
                                Created
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Updated
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sopData.length > 0 ? (
                            sopData.map((sop) => (
                                <TableRow
                                    key={sop.id}
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setSelectedSOPData(sop);
                                        setSopViewDialogOpen(true);
                                    }}
                                >
                                    <TableCell className="font-medium">
                                        {sop.title}
                                    </TableCell>
                                    <TableCell>{sop.created_at}</TableCell>
                                    <TableCell>
                                        {sop.updated_at ?? "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No SOP data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* SOP View Dialog */}
                <Dialog
                    open={sopViewDialogOpen}
                    onOpenChange={setSopViewDialogOpen}
                >
                    <DialogContent fullScreen>
                        <div className="flex flex-col h-full p-6">
                            <DialogHeader className="pb-4 border-b">
                                <DialogTitle className="text-2xl font-bold">
                                    {selectedSOPData?.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col flex-1">
                                <div className="flex-1 space-y-6 py-6">
                                    {/* Metadata Section */}
                                    <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created Date
                                            </label>
                                            <p className="text-sm font-medium mt-1">
                                                {selectedSOPData?.created_at}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="text-sm font-medium mt-1">
                                                {selectedSOPData?.updated_at}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            Content
                                        </label>
                                        <div className="h-[calc(100vh-400px)] overflow-y-auto p-4 bg-background border rounded-lg">
                                            <div
                                                className="prose prose-sm max-w-none text-sm leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        selectedSOPData?.content ||
                                                        "<p>No content available</p>",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setSopViewDialogOpen(false)
                                        }
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
