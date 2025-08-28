import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
const url = new URL(apiUrl);

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: url.protocol.replace(":", ""), // "http" / "https"
                hostname: url.hostname, // "127.0.0.1"
                port: url.port || "", // "8000"
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "dppicms.devta.id",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${apiUrl}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
