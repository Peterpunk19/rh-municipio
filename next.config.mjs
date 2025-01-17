const nextConfig = {reactStrictMode: false,
    env: {
        NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    }


};

export default nextConfig;
