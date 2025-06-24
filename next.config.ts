import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    // Exclude svg from the default asset rule
    const fileLoaderRule = config.module?.rules?.find((rule: any) =>
      rule?.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // Add SVGR rule
    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true, // optional: scales SVGs like icons
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
