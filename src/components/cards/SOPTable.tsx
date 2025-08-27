import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type SOP = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string | null;
};

interface SOPTableProps {
    sopData: SOP[];
}

export default function SOPTable({ sopData }: SOPTableProps) {
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
                                    className={`cursor-pointer transition-colors`}
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
            </div>
        </div>
    );
}
