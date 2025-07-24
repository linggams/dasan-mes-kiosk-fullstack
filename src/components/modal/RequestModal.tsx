"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { RequestFormData } from "@/types/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
    onSubmit,
}: Props) {
    if (!open) return null;

    const buyerOptions = buyers.map((b) => ({ value: b.id, label: b.name }));
    const styleOptions = styles.map((s) => ({ value: s.id, label: s.style }));
    const supervisorOptions = supervisors.map((s) => ({
        value: s.id,
        label: s.name,
    }));

    return (
        <div
            className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
             ${open ? "flex" : "hidden"} `}
        >
            <div className="z-50 bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-xl text-gray-500"
                        />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Create Request
                    </h3>
                    <div className="space-y-3">
                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div>
                                <Label className="mb-2">Buyer</Label>
                                <Select
                                    options={buyerOptions}
                                    value={
                                        buyerOptions.find(
                                            (opt) =>
                                                opt.value === formData.buyer_id
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setFormData({
                                            ...formData,
                                            buyer_id: selected?.value ?? 0,
                                            cutting_id: 0, // reset style on buyer change
                                        })
                                    }
                                    placeholder="Select Buyer"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Style</Label>
                                <Select
                                    options={styleOptions}
                                    value={
                                        styleOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                formData.cutting_id
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setFormData({
                                            ...formData,
                                            cutting_id: selected?.value ?? 0,
                                        })
                                    }
                                    placeholder="Select Style"
                                    isDisabled={!formData.buyer_id}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Supervisor</Label>
                                <Select
                                    options={supervisorOptions}
                                    value={
                                        supervisorOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                formData.supervisor_id
                                        ) || null
                                    }
                                    onChange={(selected) =>
                                        setFormData({
                                            ...formData,
                                            supervisor_id: selected?.value ?? 0,
                                        })
                                    }
                                    placeholder="Select Supervisor"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

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
