/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports ={
  nextConfig,
  env: {
    contractAddress: "0x073fDC21277Ab1b4a95AdeA2301C50b7Ff74E7b5",
  },
  images: {
    domains: ['testnets-api.opensea.io'],
  },
  reactStrictMode: false,
}