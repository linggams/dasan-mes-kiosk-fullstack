"use client";

import React from "react";

type Props = {
    value: string;
    onChange?: (value: string) => void;
};

export default function StageSelector({ value, onChange }: Props) {
    const stages = ["process", "finishing", "washing"];

    return (
        <div className="flex space-x-2 mr-5">
            {stages.map((stage) => (
                <label key={stage}>
                    <input
                        type="radio"
                        name="stage"
                        value={stage}
                        defaultChecked={value === stage}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="sr-only peer"
                    />
                    <div className="px-3 py-1 rounded bg-gray-100 text-gray-600 cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white capitalize">
                        {stage}
                    </div>
                </label>
            ))}
        </div>
    );
}
