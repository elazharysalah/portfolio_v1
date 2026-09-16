import type { NextConfig } from "next";

const lanOrigins = (process.env.ALLOWED_DEV_ORIGINS || "192.168.3.57")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: "standalone",
  agentRules: false,
  // Required so phone/LAN can load Next.js client JS in development
  allowedDevOrigins: lanOrigins,
};

export default nextConfig;
