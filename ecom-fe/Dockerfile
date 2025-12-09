# -----------------------------
# 1️⃣ Build Stage
# -----------------------------
FROM node:20-alpine as builder
RUN apk --no-cache add bash

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build Vite production output
RUN npm run build


# -----------------------------
# 2️⃣ Runtime Stage - NGINX
# -----------------------------
FROM nginx:stable-alpine as runner

WORKDIR /app

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy build output created by Vite (dist folder)
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
