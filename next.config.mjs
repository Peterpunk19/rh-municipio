const nextConfig = {reactStrictMode: false,
    env: {
        NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXT_PUBLIC_BASE_API_AUTH: process.env.NEXT_PUBLIC_BASE_API_AUTH,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    }


};

export default nextConfig;
