/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['blog-app-post-images100402-dev.s3.sa-east-1.amazonaws.com']
  }
}

module.exports = nextConfig
