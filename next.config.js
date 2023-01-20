/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "nextjs.org",
      "spin.atomicobject.com",
      "i.imgur.com",
      "blog.appsignal.com",
      "ph-files.imgix.net",
    ],
  },
};

module.exports = nextConfig;
