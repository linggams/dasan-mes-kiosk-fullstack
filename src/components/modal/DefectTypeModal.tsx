"use client";

import React, { useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MasterDefectType} from "@/hooks/useMasterData";

type Props = {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    onSelect: (defects: MasterDefectType[]) => void;
    types: MasterDefectType[];
};

export default function DefectTypeModal({ open, onClose, onBack, onSelect, types }: Props) {
    const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

    const toggleDefect = (key: string) => {
        setSelectedDefects((prev) =>
            prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
        );
    };

    const handleNext = () => {
        const selected = types.filter((d) => selectedDefects.includes(d.key));
        onSelect(selected);
    };

    if (!open) return null;

    return (
        <div id="defectDialog" className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50
            ${open ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500" />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Select Defect Type
                    </h3>

                    <div className="space-y-3">
                        {types.map((item) => (
                                <label
                                    key={item.key}
                                    className="flex items-center space-x-4 w-full px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-lg"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDefects.includes(item.key)}
                                        onChange={() => toggleDefect(item.key)}
                                        className="h-5 w-5 text-blue-500 rounded border-gray-300"
                                    />
                                    <span>{item.label}</span>
                                </label>
                            )
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        <button onClick={handleNext}
                                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg">
                            Next
                        </button>
                        <button
                            onClick={onBack}
                            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-lg"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
