/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*", // '/api'로 시작하는 모든 요청을
        destination: "http://localhost:38080/api/:path*", // 백엔드 서버 주소로 전달합니다.
      },
    ];
  },
};

export default nextConfig;
