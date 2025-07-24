export type OrderInfo = {
    date: string;
    loading: number;
    working: number;
    target: number;
    inspect: number;
    pass: number;
    cncm: number;
    balance: number;
    defect_percentage: number;
    progress_percentage: number;
};

export type ManPower = {
    class_name: string;
    total: number;
}[];
