module.exports = {
  reactStrictMode: false,
  images: {
    domains: [
      "tailwindui.com",
      "i.ibb.co",
      "ipfs.moralis.io",
      "s3.amazonaws.com",
    ],
  },
  env: {
    RPC_Provider_Id: "fd8c82f8245c47f3a94ee7fa9a4d8701",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
