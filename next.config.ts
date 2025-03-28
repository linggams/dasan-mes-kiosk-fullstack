import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: process.env.NEXT_PUBLIC_API_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_API_BASE_URL?.replace("https://", "").replace("http://", ""),
                port: "",
                pathname: "/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
