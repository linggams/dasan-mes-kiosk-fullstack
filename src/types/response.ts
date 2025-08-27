export type ApiResponse<T> = {
    status: "success" | "error";
    success: boolean;
    message: string;
    data: T;
};
