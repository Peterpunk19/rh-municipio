# ==========================
# Etapa base: común a dev y prod
# ==========================
FROM node:22-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copiamos solo manifests para aprovechar caché
COPY package.json yarn.lock ./

# Instalar dependencias completas (incluye prisma en devDeps)
RUN yarn install --frozen-lockfile

# Copiar código
COPY . .

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
ENV NODE_ENV=production
# ⚡ Generar el cliente Prisma junto con el build
RUN yarn prisma generate && yarn build

# ==========================
# Etapa producción final
# ==========================
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH

# Copiar package.json / yarn.lock e instalar dependencias de prod
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copiar build, static assets y Prisma Client desde build
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["yarn", "start"]
