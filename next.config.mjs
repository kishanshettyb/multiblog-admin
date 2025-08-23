import nextra from 'nextra';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   missingSuspenseWithCSRBailout: false
  //   reactRefresh: false
  // },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true // Allow production builds with TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true // Allow production builds with ESLint errors
  },
  images: {
    domains: ['ik.imagekit.io', 'images.unsplash.com', 'cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '3000',
        pathname: '/dashboard/**'
      }
    ]
  },
  webpack(config) {
    // Filter out ReactFreshWebpackPlugin
    config.plugins = config.plugins.filter((plugin) => {
      return plugin.constructor.name !== 'ReactFreshWebpackPlugin';
    });
    config.module.rules.push({
      test: /\.(mp3|wav)$/, // Match .mp3 and .wav files
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[name].[ext]',
          esModule: false
        }
      }
    });

    return config;
  }
};




export default nextConfig;