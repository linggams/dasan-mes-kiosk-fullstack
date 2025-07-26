"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import FactoryLine from "@/components/FactoryLine";
import FactoryPacking from "@/components/FactoryPacking";

interface HeaderProps {
    type: "home" | "packing";
    date: string;
    time: string;
    toggleSidebar: () => void;
    isSidebarOpen?: boolean;
}

export default function Header({
    type,
    date,
    time,
    toggleSidebar,
    isSidebarOpen,
}: HeaderProps) {
    return (
        <header
            className={`${
                isSidebarOpen ? "" : "sticky top-0"
            } z-40 bg-white/80 border-b border-gray-200 backdrop-blur-md p-4 mt-0`}
        >
            <div className="grid grid-cols-2 items-center">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </Button>
                    {type === "packing" ? <FactoryPacking /> : <FactoryLine />}
                </div>

                <div className="flex items-center justify-end space-x-4">
                    <span className="text-lg font-bold">{date}</span>
                    <span className="text-lg font-bold">{time}</span>
                </div>
            </div>
        </header>
    );
}
