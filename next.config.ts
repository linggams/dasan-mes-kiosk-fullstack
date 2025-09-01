import type { NextConfig } from "next";

const protocol =
    process.env.NEXT_PUBLIC_API_PROTOCOL === "https" ? "https" : "http";
const hostname =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("https://", "").replace(
        "http://",
        ""
    ) ?? "";
const port = `${process.env.NEXT_PUBLIC_API_BASE_PORT}`;
const destination = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`;

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: protocol,
                hostname: hostname,
                port: port,
                pathname: "/storage/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: destination,
            },
        ];
    },
};

export default nextConfig;
