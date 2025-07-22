"use client";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RequestListPanel from "@/components/RequestListPanel";

export default function Sidebar({
    isOpen,
    onClose,
    handleOpenRequestModal,
    fetchRequestDetail,
    selectedRequestId,
    refetchSignal,
}: {
    isOpen: boolean;
    onClose: () => void;
    handleOpenRequestModal: () => void;
    fetchRequestDetail: () => void;
    selectedRequestId?: string;
    refetchSignal: number;
}) {
    return (
        <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 p-4 z-40 transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Close Button */}
            <div className="mb-4 flex justify-end md:hidden">
                <Button size="icon" variant="ghost" onClick={onClose}>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-xl text-gray-500"
                    />
                </Button>
            </div>

            {/* Request Button */}
            <div className="mb-4">
                <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                    onClick={handleOpenRequestModal}
                >
                    Request
                </Button>
            </div>

            {/* List Panel */}
            <div className="overflow-y-auto h-[calc(100vh-120px)] pr-1">
                <RequestListPanel
                    fetchRequestDetail={fetchRequestDetail}
                    requestId={selectedRequestId}
                    refetchSignal={refetchSignal}
                />
            </div>
        </aside>
    );
}
