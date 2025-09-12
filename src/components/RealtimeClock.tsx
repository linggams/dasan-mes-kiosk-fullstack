"use client";

import { useEffect, useState } from "react";

export default function RealtimeClock() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formattedDate = dateTime
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .replace(/\//g, "-");

    const formattedTime = dateTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <span className="text-xl font-bold text-gray-900">
            {formattedDate} {formattedTime}
        </span>
    );
}
