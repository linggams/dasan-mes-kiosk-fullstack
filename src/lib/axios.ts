import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
// import ApiResponse from "@types/response.ts";

// Kiosk API
export const kiosk = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/${process.env.NEXT_PUBLIC_API_VERSION}`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Master API
export const master = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master`,
    headers: {
        "Content-Type": "application/json",
    },
});

const onResponse = <T>(response: AxiosResponse<T>) => response.data;
const onError = (error: AxiosError) => {
    let message = "Unknown API error";

    if (error.response) {
        const data = error.response.data;

        if (typeof data === "string") {
            message = data;
            toast.warning(message);
        } else if (data && typeof data === "object") {
            const { errors, message: msg } = data as {
                errors?: string | string[];
                message?: string;
            };

            if (errors) {
                message = Array.isArray(errors) ? errors.join(", ") : errors;
                toast.warning(message);
            } else if (msg) {
                message = msg;
                toast.warning(message);
            } else {
                message = JSON.stringify(data);
                toast.error(message); // fallback -> error
            }
        } else {
            message = `Request failed with status ${error.response.status}`;
            toast.error(message);
        }
    } else if (error.request) {
        message = "No response from server. Possible network/CORS issue.";
        toast.error(message);
    } else {
        message = error.message;
        toast.error(message);
    }

    return Promise.reject(new Error(message));
};

kiosk.interceptors.response.use(onResponse, onError);
master.interceptors.response.use(onResponse, onError);
