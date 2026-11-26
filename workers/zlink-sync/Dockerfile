# Build separado del frontend. No copia .env, session.json ni cookies al image layer.
FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY workers/zlink-sync/src ./workers/zlink-sync/src
COPY workers/zlink-sync/bin ./workers/zlink-sync/bin
RUN npx prisma generate --schema=prisma/schema.prisma
RUN mkdir -p /app/state && chown node:node /app/state
USER node
ENV NODE_ENV=production \
    ZLINK_SESSION_FILE=/app/state/session.json \
    ZLINK_LOCK_FILE=/run/zlink/sync.lock
CMD ["node", "workers/zlink-sync/bin/sync.mjs", "--daemon"]
