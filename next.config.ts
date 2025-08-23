import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   domains: ["tantrang-backend.onrender.com"],
  // },
  // Tắt linting toàn bộ trong build (Next.js)
  eslint: {
    // Cho phép build vẫn thành công ngay cả khi có lỗi ESLint
    ignoreDuringBuilds: true,
  },

  images: {
    // Thêm các hostname được phép vào đây
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tantrang-backend.onrender.com", // Giữ lại nếu bạn vẫn dùng Render cho backend API
        port: "",
        pathname: "/uploads/**", // Pathname này sẽ không còn cần thiết cho ảnh từ Supabase
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Thêm wildcard để khớp với miền Supabase Storage của bạn
        port: "",
        pathname: "/storage/v1/object/public/**", // Pathname cụ thể cho Supabase Storage
      },
    ],
    // Hoặc bạn có thể dùng domains (cách cũ hơn nhưng vẫn hoạt động với Next.js 13/14)
    // domains: ['tantrang-backend.onrender.com'],
  },
};

export default nextConfig;
