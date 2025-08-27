export type LineInfo = {
    factory: string;
    line: string;
    request_id: string;
    buyer: string;
    style: string;
    status: string;
};

export type OrderInfo = {
    id: number;
    date: string;
    loading: number;
    working: number;
    target: number;
    inspect: number;
    pass: number;
    cncm: number;
    balance: number;
    defect: number;
    defect_percentage: number;
    man_power: number;
    progress_percentage: number;
};

export type ProductionData = {
    actual: number[];
    cumulative: number[];
};

export type ExtraData = {
    line_group: string;
    code: string;
    buyer: string;
    style: string;
    target: number;
    [key: `h${number}`]: number; // h0-h23
    total_produced: number;
};

export type RequestLinesTypes = {
    line_info: LineInfo;
    order_info: OrderInfo;
    production_data: ProductionData;
    extra_data: ExtraData;
};
