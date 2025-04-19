import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
    ],
  },
};

// You likely want to merge your nextConfig object with any other configurations
// you might be exporting. If you don't have any other exports, you can directly
// export nextConfig.

// Example of merging with another export (if needed):
// module.exports = {
//   otherConfig: 'someValue',
//   ...nextConfig,
// };

// If you don't have other exports, simply:
module.exports = nextConfig;

// The 'export default' is also correct and a common way to export the main config:
export default nextConfig;