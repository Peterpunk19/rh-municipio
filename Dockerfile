FROM node:22-alpine AS base

# Set the working directory in the container
WORKDIR /app

FROM base AS development
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 3001
# Set environment to development
ENV NODE_ENV=development
CMD ["yarn", "dev"]
