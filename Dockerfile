# Frontend de El Volcán Market en Docker.
# Normalmente lo construye el docker-compose.yml del repo backend (--profile web).
#   docker build -t elvolcan-frontend .

# ---------- Etapa 1: build de producción con Vite ----------
FROM node:22-alpine AS build
WORKDIR /app
# Primero las dependencias (se guardan en caché si package*.json no cambia).
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# La API queda en la misma dirección que la página (/api/v1): nginx la reenvía al Gateway.
RUN npm run build

# ---------- Etapa 2: nginx sirve los archivos estáticos ----------
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
