"use client";

type Props = {
    code?: string;
    buyer?: string;
    style?: string;
};

export default function RequestInfo({ code, buyer, style }: Props) {
    return (
        <div className="flex flex-wrap gap-x-4 text-gray-700">
            <div>
                <span className="text-gray-500">Request ID: </span>
                <span className="font-bold">{code || "-"}</span>
            </div>
            <div>
                <span className="text-gray-500">Buyer: </span>
                <span className="font-bold">{buyer || "-"}</span>
            </div>
            <div>
                <span className="text-gray-500">Style: </span>
                <span className="font-bold">{style || "-"}</span>
            </div>
        </div>
    );
}
