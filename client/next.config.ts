import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // For AWS S3 if used
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // For Cloudinary if used
      },
      {
        protocol: 'https',
        hostname: 'chililabs.io', // For template thumbnails
      }
    ],
  }
};

export default nextConfig;
