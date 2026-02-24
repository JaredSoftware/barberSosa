# Nuxt - barber (frontend público)
FROM node:20-alpine AS base
WORKDIR /app

# Build (necesita devDependencies para nuxt build)
# --ignore-scripts evita compilar mozjpeg/imagemin; no se usa en el build de Nuxt
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Producción (solo el output de Nitro)
FROM base AS runner
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
USER node
CMD ["node", ".output/server/index.mjs"]
