# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./

# If your output is fully static or doesn't need node_modules, omit the above

EXPOSE 3000

# Use direct Node.js entrypoint (faster, lighter)
CMD ["node", "server/index.mjs"]
