import {ManPower, OrderInfo} from "@/types/order";

export type Request = {
    id: number;
    code: string;
    status: string;
    buyer: string;
    style: string;
};

export type RequestFormData = {
    buyer_id?: number;
    order_id?: number;
    line_id?: number;
    supervisor_id?: number;
};

export type RequestData = {
    code: string;
    buyer: string;
    style: string;
};

export type ProductionData = {
    actual: number[];
    cumulative: number[];
};

