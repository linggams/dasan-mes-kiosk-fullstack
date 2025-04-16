"use client";

import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Props = {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    onFail: (isRework: boolean) => void;
};

export default function ActionModal({ open, onClose, onBack, onFail }: Props) {
    if (!open) return null;

    return (
        <div id="actionDialog" className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm items-center justify-center z-50 
            ${open ? "flex" : "hidden"} `}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
                <div className="p-8 relative">
                    <button
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-500" />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Action</h3>
                    <div className="space-y-4">
                        <button id="reworkButton"
                                onClick={() => onFail(true)} // Rework
                                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg">
                            Rework
                        </button>
                        <button id="cncmButton"
                                onClick={() => onFail(false)} // CNCM
                                className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors text-lg">
                            CNCM
                        </button>
                        <button id="backToDefect"
                                onClick={onBack}
                                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-lg">
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}