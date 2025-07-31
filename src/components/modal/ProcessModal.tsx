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
    onNext: (isRework: boolean) => void;
    selectedDefects: MasterDefectType[];
    processOptions: { label: string; value: number }[];
    selectedProcesses: Record<string, number[]>;
    onProcessSelect: (defectKey: string, processIds: number[]) => void;
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

    const isProcessSelectionComplete = selectedDefects.every(
        (defect) =>
            selectedProcesses[defect.key] &&
            selectedProcesses[defect.key].length > 0
    );

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

                    <div
                        className="space-y-4 max-h-150 pr-2"
                        style={{
                            height: "40vh",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
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
                        {!isProcessSelectionComplete && (
                            <p className="text-red-500 text-sm mt-2">
                                Please select at least one process for each
                                defect before proceeding.
                            </p>
                        )}

                        <button
                            onClick={() => {
                                onBack();
                                onClose();
                            }}
                            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onNext(false)}
                            className={`px-6 py-3 rounded-lg text-white ${
                                isProcessSelectionComplete
                                    ? "bg-red-400 hover:bg-red-500"
                                    : "bg-red-200 cursor-not-allowed"
                            }`}
                            disabled={!isProcessSelectionComplete}
                        >
                            CNCM
                        </button>

                        <button
                            onClick={() => onNext(true)}
                            className={`px-6 py-3 rounded-lg text-white ${
                                isProcessSelectionComplete
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!isProcessSelectionComplete}
                        >
                            Rework
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
