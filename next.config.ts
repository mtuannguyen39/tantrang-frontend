import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt linting toàn bộ trong build (Next.js)
  eslint: {
    // Cho phép build vẫn thành công ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
  },

  // ép kiểu để không bị lỗi type
  experimental: {
    missingSuspenseWithCSRBailout: false,
  } as any,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tantrang-backend.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Hoặc cách cũ:
    // domains: ["tantrang-backend.onrender.com"],
  },
};

export default nextConfig;
