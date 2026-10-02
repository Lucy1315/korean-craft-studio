import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 폴더의 package-lock.json을 루트로 오인하지 않도록 이 프로젝트를 루트로 고정한다.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
