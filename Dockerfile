# Use a node image for building the frontend
FROM node:latest AS build

# Set the working directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_SERVER_URI
ENV VITE_SERVER_URI=${VITE_SERVER_URI}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY /default.conf /etc/nginx/conf.d/default.conf
