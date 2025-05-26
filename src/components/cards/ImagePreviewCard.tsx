import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Props = {
    data?: string;
};

export default function ImagePreviewCard({ data }: Props) {
    return (
        <Card className="bg-white rounded-xl shadow-xl border-none">
            <CardContent>
                <Image
                    src={data || "/placeholder.svg"}
                    className="w-full h-auto"
                    alt="Image preview"
                    width={500}
                    height={300}
                />
            </CardContent>
        </Card>
    );
}
