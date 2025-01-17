FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /app

FROM base AS development
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["yarn", "dev"]
