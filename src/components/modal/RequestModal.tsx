"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RequestFormData } from "@/types/request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

type Props = {
    open: boolean;
    onClose: () => void;
    buyers: { id: number; name: string }[];
    styles: { id: number; style: string }[];
    supervisors: { id: number; name: string }[];
    formData: RequestFormData;
    setFormData: (data: RequestFormData) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function RequestModal({
    open,
    onClose,
    buyers,
    styles,
    supervisors,
    formData,
    setFormData,
    onSubmit
}: Props) {
    if (!open) return null;

    return (
        <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
             ${open ? "flex" : "hidden"} `}>
            <div className="z-50 bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500" />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Create Request
                    </h3>
                    <div className="space-y-3">
                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div>
                                <Label className="mb-2">Buyer</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, buyer_id: Number(value) })
                                    }
                                    value={formData.buyer_id ? String(formData.buyer_id) : undefined}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Buyer" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full z-50 bg-white">
                                        {buyers?.map((buyer) => (
                                            <SelectItem key={buyer.id} value={String(buyer.id)}>
                                                {buyer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Style</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, order_id: Number(value) })
                                    }
                                    value={formData.order_id ? String(formData.order_id) : undefined}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Style" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full z-50 bg-white">
                                        {styles?.map((order) => (
                                            <SelectItem key={order.id} value={String(order.id)}>
                                                {order.style}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2">Supervisor</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, supervisor_id: Number(value) })
                                    }
                                    value={
                                        formData.supervisor_id ? String(formData.supervisor_id) : undefined
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Supervisor" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full z-50 bg-white">
                                        {supervisors?.map((sup) => (
                                            <SelectItem key={sup.id} value={String(sup.id)}>
                                                {sup.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/*<SearchableSelect*/}
                            {/*    label="Buyer"*/}
                            {/*    options={buyers.map((b) => ({ id: b.id, label: b.name }))}*/}
                            {/*    value={formData.buyer_id}*/}
                            {/*    onChange={(id) => setFormData({ ...formData, buyer_id: id })}*/}
                            {/*/>*/}

                            {/*<SearchableSelect*/}
                            {/*    label="Style"*/}
                            {/*    options={styles.map((s) => ({ id: s.id, label: s.style }))}*/}
                            {/*    value={formData.order_id}*/}
                            {/*    onChange={(id) => setFormData({ ...formData, order_id: id })}*/}
                            {/*/>*/}

                            {/*<SearchableSelect*/}
                            {/*    label="Supervisor"*/}
                            {/*    options={supervisors.map((s) => ({ id: s.id, label: s.name }))}*/}
                            {/*    value={formData.supervisor_id}*/}
                            {/*    onChange={(id) => setFormData({ ...formData, supervisor_id: id })}*/}
                            {/*/>*/}

                            <div className="mt-8 flex gap-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
                                >
                                    Submit Request
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
