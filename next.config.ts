import path from "node:path";
import type { NextConfig } from "next";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const nextConfig: NextConfig = {
  transpilePackages: ["toolbox"],
  webpack: (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins ?? []),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ];
    return config;
  },
};

export default nextConfig;
