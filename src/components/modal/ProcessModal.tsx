"use client";

import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { MasterDefectType } from "@/hooks/useMasterData";

type Props = {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    onNext: () => void;
    selectedDefects: MasterDefectType[];
    processOptions: { label: string; value: number }[];
    selectedProcesses: Record<string, number[]>;
    onProcessSelect: (defectKey: string, processId: number) => void;
};

export default function ProcessModal({
    open,
    onClose,
    onBack,
    onNext,
    selectedDefects,
    processOptions,
    selectedProcesses,
    onProcessSelect,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>

                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Step 3
                    </h3>
                    <p className="text-gray-500 mb-4">
                        For each defect selected, please assign the processes
                        where it occurred.
                    </p>

                    <div className="space-y-4 max-h-120 overflow-y-auto pr-2">
                        {selectedDefects.map((defect) => (
                            <div key={defect.key}>
                                <label className="block mb-2 font-semibold">
                                    {defect.label}
                                </label>
                                <Select
                                    isMulti
                                    options={processOptions}
                                    value={processOptions.filter((opt) =>
                                        (
                                            selectedProcesses[defect.key] || []
                                        ).includes(opt.value)
                                    )}
                                    onChange={(selected) =>
                                        onProcessSelect(
                                            defect.key,
                                            Array.isArray(selected)
                                                ? selected.map((s) => s.value)
                                                : []
                                        )
                                    }
                                    className="w-full"
                                    placeholder="Select one or more processes"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onBack}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNext(false)}
                            className="bg-red-400 text-white px-6 py-3 rounded-lg hover:bg-red-500"
                        >
                            CNCM
                        </button>
                        <button
                            onClick={() => onNext(true)}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                        >
                            Rework
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
