import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer uses Node.js native modules — must be external in App Router
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
