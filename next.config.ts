import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    additionalData: `@use '@/styles/breakpoints' as *;`,
  },
};

export default nextConfig;