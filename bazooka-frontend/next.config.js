/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports ={
  nextConfig,
  env: {
    contractAddress: "0x09432216C64C6Ef213Bc7Bf83b1c884A0a73C274",
  },
  images: {
    domains: ['testnets-api.opensea.io'],
  },
  reactStrictMode: false,
}