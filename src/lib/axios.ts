import axios, { AxiosError, AxiosResponse } from "axios";
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
    // Default message
    let message = "Unknown API error";

    if (error.response) {
        if (typeof error.response.data === "string") {
            message = error.response.data;
        } else if (
            error.response.data &&
            typeof error.response.data === "object"
        ) {
            const data = error.response.data as { message?: string };
            message = data.message || JSON.stringify(data);
        } else {
            message = `Request failed with status ${error.response.status}`;
        }
    } else if (error.request) {
        message = "No response from server. Possible network/CORS issue.";
    } else {
        message = error.message;
    }

    return Promise.reject(new Error(message));
};

kiosk.interceptors.response.use(onResponse, onError);
master.interceptors.response.use(onResponse, onError);
