# Use a node image for building the frontend
FROM node:latest AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Use nginx to serve the built files
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY /default.conf /etc/nginx/conf.d/default.conf
