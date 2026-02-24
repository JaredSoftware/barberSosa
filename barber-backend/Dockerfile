# NestJS - barber-backend
FROM node:20-alpine AS base
WORKDIR /app

# Dependencias
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Producción
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
USER node
CMD ["node", "dist/main.js"]
