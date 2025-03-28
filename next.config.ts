import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: "dppicms.test",
                port: "",
                pathname: "/storage/**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://dppicms.test/api/:path*",
            },
        ];
    },
};

export default nextConfig;
