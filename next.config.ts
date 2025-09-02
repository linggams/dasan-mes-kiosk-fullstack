import type { NextConfig } from "next";

const protocol =
    process.env.NEXT_PUBLIC_API_PROTOCOL === "https" ? "https" : "http";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""; // e.g. http://127.0.0.1:8000

// Strip protocol first
const withoutProtocol = baseUrl.replace(/^https?:\/\//, "");

// Extract hostname and port
const [rawHost, rawPort] = withoutProtocol.split(":");

const hostname = rawHost || "localhost";
const port = rawPort || process.env.NEXT_PUBLIC_API_BASE_PORT || "";

const destination = `${baseUrl}/api/:path*`;

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol,
                hostname,
                port,
                pathname: "/storage/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination,
            },
        ];
    },
};

export default nextConfig;
