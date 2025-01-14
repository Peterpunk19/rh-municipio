# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files first to cache dependencies
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 3001

# Set environment to development
ENV NODE_ENV=development

# Start the app in development mode
CMD ["yarn", "dev"]
