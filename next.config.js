/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        workerThreads: false,
    },
    serverExternalPackages: ["pino", "pino-pretty"],

    typescript: {
        ignoreBuildErrors: true,
    },

    // 🔧 Desactivar optimización de imágenes (no usa sharp)
    images: {
        unoptimized: true,
        disableStaticImages: true, // 👈 clave: evita que Next importe imágenes con sharp
    },

    // 🔥 Evita que Next intente usar sharp en builds locales
    env: {
        NEXT_DISABLE_SHARP: "1",
    },
};

module.exports = nextConfig;
