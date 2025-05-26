# Stage 1: Builder
FROM oven/bun:latest AS builder
WORKDIR /app

# 1) instalamos con Bun
COPY package.json bun.lock ./
RUN bun install

# 2) copiamos todo el código fuente y compilamos
COPY . .
RUN bun run build
# —> tras esto tendrás en /app/dist/ tanto tu JS como, gracias al postbuild,
#     la carpeta dist/assets con tus imágenes

# Stage 2: Runtime
FROM node:18-slim AS runtime
WORKDIR /app

# 3) Instalamos sólo las libs nativas que pide Puppeteer/EJS
RUN apt-get update && apt-get install -y \
    fonts-liberation libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 libnss3 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    xdg-utils chromium unzip ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# 4) Copiamos el código compilado + assets
COPY --from=builder /app/dist       ./dist
# (si por alguna razón tus assets no quedaron bajo dist/assets,
#  añade esta línea para copiarlos directamente de src)
# COPY --from=builder /app/src/templates/assets ./dist/assets

# 5) Copiamos las dependencias que Bun instaló
COPY --from=builder /app/node_modules ./node_modules

# 3) **COPIAMOS LAS PLANTILLAS** (¡añádelo!)
COPY --from=builder /app/src/templates ./src/templates

# 6) Abrimos el puerto que definiste en tu .env (3000)
EXPOSE 3000

# 7) Arrancamos el servidor
CMD ["node", "dist/server.js"]
