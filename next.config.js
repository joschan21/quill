/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/api/auth/login',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
      },
    ]
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Avoid trying to use 'canvas' and 'encoding' packages in the webpack build since they're not compatible or not needed
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },

  // Configuration for 'next/image' to allow images from external URLs
  images: {
    // Specify allowed image domains to prevent errors when using external images
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
