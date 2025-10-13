# syntax=docker/dockerfile:1.6

# ==========================
# Etapa base: dependencias
# ==========================
FROM node:22-slim AS base
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

# Dependencias del sistema necesarias para sharp y prisma
RUN apt-get update -y && apt-get install -y \
  openssl \
  libvips-dev \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Copiar manifests primero (mejor caché)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ==========================
# Etapa desarrollo
# ==========================
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3001
CMD ["sh", "-c", "yarn prisma generate && yarn dev"]

# ==========================
# Etapa build (producción)
# ==========================
FROM base AS build
WORKDIR /app

# Copiar configuración antes del resto
COPY next.config.js ./
COPY . .

ENV NODE_ENV=production

# Generar Prisma Client
RUN npx prisma generate --schema=prisma/schema.prisma

# Compilar Next.js
RUN yarn build

# ==========================
# Etapa producción final
# ==========================
FROM node:22-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV PATH=/app/node_modules/.bin:$PATH

# Dependencias necesarias en runtime
RUN apt-get update -y && apt-get install -y \
  openssl \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

# Copiar artefactos del build
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env.prod ./.env

# Exponer el puerto que usará Cloud Run
EXPOSE 8080

# ✅ Ejecutar el servidor Next.js en modo clásico
CMD ["sh", "-c", "yarn start -p ${PORT}"]
