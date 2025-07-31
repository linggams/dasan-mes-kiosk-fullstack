export type Request = {
    id: number;
    code: string;
    status: string;
    buyer: string;
    style: string;
    date: string;
};

export type RequestFormData = {
    buyer_id?: number;
    cutting_id?: number;
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

export type FactoryTypes = {
    id: number;
    name: string;
};

export type LineInfoTypes = {
    factory: string;
    line: string;
    request_id: string;
    buyer: string;
    style: string;
    status: string;
};

export type ProcessLayout = {
    no: number;
    id: number;
    process: string;
    machineType: string;
    classType: string;
    tooling: string;
    standardTime: string;
    video?: string;
    manPower: string;
};

export type OrderProcess = {
    id: number;
    name: string;
};
