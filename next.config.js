/** @type {import('next').NextConfig} */
module.exports = {
    output: "standalone",
    experimental: {
        workerThreads: false,
    },
    serverExternalPackages: ['pino', 'pino-pretty'],
};
