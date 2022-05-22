/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports ={
  nextConfig,
  env: {
    contractAddress: "0x5B64eECAE3D0e09E4FC6451B7274D86169D67A62",
  },
  images: {
    domains: ['testnets-api.opensea.io'],
  },
  reactStrictMode: false,
}