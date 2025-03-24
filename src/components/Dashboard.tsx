"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setDate(now.toLocaleDateString());
            setTime(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const target = 432;
    const pass = 334;
    const inspect = 400;
    const defectPercentage = 2;
    const balance = pass - target;
    const progressPercentage = Math.min(100, Math.round((334 / 432) * 100));
    const cumulativeData = [0,0,0,0,0,0,0,20,40,60,80,100,120,120,140,160,180,200,200,200,200,200,200,200];

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <Card className="flex justify-between items-center p-4 bg-white/80 border border-gray-200">
                <div className="flex items-center space-x-4">
                    <Button variant="outline"><i className="fas fa-bars"></i></Button>
                    <span className="font-bold text-lg">FACTORY 1</span>
                    <span className="font-bold text-lg">LINE A1</span>
                </div>
                <div className="flex items-center space-x-4 ml-auto">
                    <span className="text-lg font-bold">{date}</span>
                    <span className="text-lg font-bold">{time}</span>
                </div>
            </Card>

            {/* Info Bar */}
            <Card className="p-4 bg-white/80 border border-gray-200">
                <div className="flex space-x-4">
                    <span className="text-gray-500">Request ID:</span> <span className="font-bold">ID1454783154</span>
                    <span className="text-gray-500">Buyer:</span> <span className="font-bold">GAP</span>
                    <span className="text-gray-500">Style:</span> <span className="font-bold">457572-5</span>
                    <div className="flex space-x-2">
                        <label>
                            <input type="radio" name="process" value="finishing" defaultChecked className="sr-only" />
                            <div className="px-3 py-1 rounded bg-gray-100 text-gray-600 peer-checked:bg-blue-500 peer-checked:text-white">
                                Finishing
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="process" value="washing" className="sr-only" />
                            <div className="px-3 py-1 rounded bg-gray-100 text-gray-600 peer-checked:bg-blue-500 peer-checked:text-white">
                                Washing
                            </div>
                        </label>
                    </div>
                    <Input placeholder="Scan here..." className="w-40" />
                </div>
            </Card>

            {/* Order Information & Metrics */}
            <div className="grid grid-cols-4 gap-4">
                {/*Image Preview */}
                <Card>
                    <CardContent>
                        <img src="https://gap.com.ph/cdn/shop/products/cn17484535_800x.jpg" alt="Product" className="w-full h-auto" />
                    </CardContent>
                </Card>

                {/* Order Information */}
                <Card>
                    <CardContent>
                        <h3 className="text-2xl font-bold">Order Information</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-gray-500">Target</p>
                                <p className="text-xl font-bold">{target}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Inspect</p>
                                <p className="text-xl font-bold">{inspect}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Pass</p>
                                <p className="text-xl font-bold">{pass}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Defect Percentage</p>
                                <p className="text-xl font-bold">{defectPercentage}%</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Balance</p>
                                <p className="text-xl font-bold text-red-600">{balance}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500">Progress</p>
                                <Progress value={progressPercentage} className="h-3" />
                                <p className="text-lg font-bold">{progressPercentage}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Man Power */}
                <Card>
                    <CardContent>
                        <h3 className="text-2xl font-bold">Man Power</h3>
                        <p className="text-3xl font-bold text-blue-600">26</p>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-700 font-medium">Operator</span>
                                <span className="text-2xl font-bold text-blue-500">20</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-700 font-medium">Helper</span>
                                <span className="text-2xl font-bold text-red-500">2</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-700 font-medium">Iron</span>
                                <span className="text-2xl font-bold text-purple-500">3</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-700 font-medium">QC</span>
                                <span className="text-2xl font-bold text-orange-500">1</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Defect */}
                <Card>
                    <CardContent>
                        <h3 className="text-2xl font-bold mb-4">Defect</h3>
                        <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">Defect</h3>
                                <span className="text-3xl font-bold text-blue-600">29</span>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { name: "Skip Stitch", count: 10 },
                                    { name: "Broken Stitch", count: 6 },
                                    { name: "Puckering", count: 6 },
                                    { name: "Measurement", count: 4 },
                                    { name: "Seam", count: 3 }
                                ].map((defect, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-gray-700 font-medium">{defect.name}</span>
                                        <span className="text-2xl font-bold text-gray-800">{defect.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Production Data Table */}
            <Card>
                <CardContent>
                    <h3 className="text-2xl font-bold mb-4">Production Data</h3>
                    <div className="bg-white/80 p-3 rounded-xl backdrop-blur-sm border border-gray-200 overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="text-xs text-gray-700 bg-gray-50">
                                <th className="py-1.5 px-2 text-left">Time</th>
                                {[...Array(24).keys()].map(i => (
                                    <th key={i} className="py-1.5 px-2 text-center">{`${i.toString().padStart(2, '0')}:00`}</th>
                                ))}
                            </tr>
                            <tr className="text-xs border-t bg-gray-50">
                                <td className="py-1.5 px-2 font-medium text-gray-700">Cumulative</td>
                                {cumulativeData.map((value, index) => (
                                    <td key={index} className="py-1.5 px-2 text-center">{value}</td>
                                ))}
                            </tr>
                            </thead>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
