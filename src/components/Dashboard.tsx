"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {useState, useEffect} from "react";
import Image from 'next/image';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";

export default function Dashboard() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    //const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buyers, setBuyers] = useState([]);
    const [styles, setStyles] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [formData, setFormData] = useState({buyer_id: "", order_id: "", line_id: 1, supervisor_id: ""});

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setDate(now.toLocaleDateString());
            setTime(now.toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/kiosk/sewing?line=1`)
            .then((response) => response.json())
            .then((data) => setRequests(data.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/kiosk/master/buyers`)
            .then((response) => response.json())
            .then((data) => setBuyers(data.data))
            .catch((error) => console.error("Error fetching buyers:", error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/kiosk/master/styles`)
            .then((response) => response.json())
            .then((data) => setStyles(data.data))
            .catch((error) => console.error("Error fetching styles:", error));

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/kiosk/master/supervisors`)
            .then((response) => response.json())
            .then((data) => setSupervisors(data.data))
            .catch((error) => console.error("Error fetching supervisors:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('api/v1/kiosk/sewing?line=1', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
            mode: "cors",
        })
            .then((response) => response.json())
            .then((data) => {
                setIsModalOpen(false);
                setRequests(data.data);
            })
            .catch((error) => console.error("Error submitting request:", error));
    };

    const fetchRequestDetail = (reqId) => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/kiosk/sewing/${reqId}?line=1`)
            .then((response) => response.json())
            .then((data) => setSelectedRequest(data.data))
            .catch((error) => console.error("Error fetching request detail:", error));
    };

    const cumulativeData = [0, 0, 0, 0, 0, 0, 0, 20, 40, 60, 80, 100, 120, 120, 140, 160, 180, 200, 200, 200, 200, 200, 200, 200];

    return (
        <div className="flex">
            {/* Sidebar */}
            <div id="sidebar"
                 className="fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 p-4 z-40">
                <div className="mb-4">
                    <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                        onClick={() => setIsModalOpen(true)}>
                        Request
                    </Button>
                </div>
                {/* Request List */}
                <div className="space-y-1.5">
                    {requests ? (
                        requests.map((request, index) => (
                            <button key={index}
                                    className="w-full bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors text-left"
                                    onClick={() => fetchRequestDetail(request.id)}>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-900">{request.code}</span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${request.status === "approved" ? "bg-green-100 text-green-700" : request.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                      {request.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                    <span>Buyer: {request.buyer}</span>
                                    <span className="mx-1">|</span>
                                    <span>Style: {request.style}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500">Loading requests...</p>
                    )}
                </div>
            </div>
            {/* Main Content */}
            <div className="p-4 space-y-4 ml-64 w-full">
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
                    {selectedRequest && (
                        <div className="flex space-x-4">
                            <span className="text-gray-500">Request ID:</span> <span
                            className="font-bold">{selectedRequest?.request_info?.code}</span>
                            <span className="text-gray-500">Buyer:</span> <span
                            className="font-bold">{selectedRequest?.request_info?.buyer}</span>
                            <span className="text-gray-500">Style:</span> <span
                            className="font-bold">{selectedRequest?.request_info?.style}</span>
                            <div className="flex space-x-2">
                                <label>
                                    <input type="radio" name="process" value="finishing" defaultChecked
                                           className="sr-only"/>
                                    <div
                                        className="px-3 py-1 rounded bg-gray-100 text-gray-600 peer-checked:bg-blue-500 peer-checked:text-white">
                                        Finishing
                                    </div>
                                </label>
                                <label>
                                    <input type="radio" name="process" value="washing" className="sr-only"/>
                                    <div
                                        className="px-3 py-1 rounded bg-gray-100 text-gray-600 peer-checked:bg-blue-500 peer-checked:text-white">
                                        Washing
                                    </div>
                                </label>
                            </div>
                            <div className="ml-auto">
                                <Input placeholder="Scan here..." className="w-40"/>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Order Information & Metrics */}
                <div className="grid grid-cols-4 gap-4">
                    {/*Image Preview */}
                    <Card>
                        <CardContent>
                            <Image
                                src={selectedRequest?.image_preview || "/placeholder.jpg"}
                                className="w-full h-auto"
                                alt="description"
                                width={500}
                                height={300}
                            />
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card>
                        <CardContent>
                            <h3 className="text-2xl font-bold">Order Information</h3>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-gray-500">Target</p>
                                    <p className="text-xl font-bold">{selectedRequest?.order_info?.target || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Inspect</p>
                                    <p className="text-xl font-bold">{selectedRequest?.order_info?.inspect || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Pass</p>
                                    <p className="text-xl font-bold">{selectedRequest?.order_info?.pass || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Defect Percentage</p>
                                    <p className="text-xl font-bold">{selectedRequest?.order_info?.defectPercentage || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Balance</p>
                                    <p className="text-xl font-bold text-red-600">{selectedRequest?.order_info?.balance || 0}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Progress</p>
                                    <Progress value={selectedRequest?.order_info?.progressPercentage || 0} className="h-3" />
                                    <p className="text-lg font-bold">{selectedRequest?.order_info?.progressPercentage || 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Man Power */}
                    <Card>
                        <CardContent>
                            <h3 className="text-2xl font-bold">Man Power</h3>
                            <p className="text-3xl font-bold text-blue-600">{selectedRequest?.man_power?.man_power || 0}</p>
                            <div className="space-y-3 mt-4">
                                <div
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700 font-medium">Operator</span>
                                    <span
                                        className="text-2xl font-bold text-blue-500">{selectedRequest?.man_power?.man_operator || 0}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700 font-medium">Helper</span>
                                    <span
                                        className="text-2xl font-bold text-red-500">{selectedRequest?.man_power?.helper || 0}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700 font-medium">Iron</span>
                                    <span
                                        className="text-2xl font-bold text-purple-500">{selectedRequest?.man_power?.iron || 0}</span>
                                </div>
                                <div
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700 font-medium">QC</span>
                                    <span
                                        className="text-2xl font-bold text-orange-500">{selectedRequest?.man_power?.qc || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Defect */}
                    <Card>
                        <CardContent>
                            <h3 className="text-2xl font-bold">Defect</h3>
                            <div className="bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">Defect</h3>
                                    <span
                                        className="text-3xl font-bold text-blue-600">{selectedRequest?.defect_summary?.total_defect || 0}</span>
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-gray-700 font-medium">Skip Stitch</span>
                                        <span
                                            className="text-2xl font-bold text-gray-800">{selectedRequest?.defect_summary?.Skip_Stitch || 0}</span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-gray-700 font-medium">Broken Stitch</span>
                                        <span
                                            className="text-2xl font-bold text-gray-800">{selectedRequest?.defect_summary?.Broken_Stitch || 0}</span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-gray-700 font-medium">Puckering</span>
                                        <span
                                            className="text-2xl font-bold text-gray-800">{selectedRequest?.defect_summary?.Puckering || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Production Data Table */}
                <Card>
                    <CardContent>
                        <h3 className="text-2xl font-bold mb-4">Production Data</h3>
                        <div
                            className="bg-white/80 p-3 rounded-xl backdrop-blur-sm border border-gray-200 overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="text-xs text-gray-700 bg-gray-50">
                                    <th className="py-1.5 px-2 text-left">Time</th>
                                    {[...Array(24).keys()].map(i => (
                                        <th key={i}
                                            className="py-1.5 px-2 text-center">{`${i.toString().padStart(2, '0')}:00`}</th>
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

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="z-50 bg-white shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Create Request</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label>Buyer</Label>
                            <Select onValueChange={(value) => setFormData({...formData, buyer_id: Number(value)})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Buyer"/>
                                </SelectTrigger>
                                <SelectContent className="z-50 bg-white">
                                    {buyers?.map((buyer) => (
                                        <SelectItem key={buyer.id} value={String(buyer.id)}>{buyer.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Style</Label>
                            <Select onValueChange={(value) => setFormData({...formData, order_id: Number(value)})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Style"/>
                                </SelectTrigger>
                                <SelectContent className="z-50 bg-white">
                                    {styles?.map((order) => (
                                        <SelectItem key={order.id} value={String(order.id)}>{order.style}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Supervisor</Label>
                            <Select onValueChange={(value) => setFormData({...formData, supervisor_id: Number(value)})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Supervisor"/>
                                </SelectTrigger>
                                <SelectContent className="z-50 bg-white">
                                    {supervisors?.map((supervisor) => (
                                        <SelectItem key={supervisor.id}
                                                    value={String(supervisor.id)}>{supervisor.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium">Submit
                                Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
