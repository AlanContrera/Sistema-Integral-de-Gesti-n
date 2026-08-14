FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos de dependencias primero
COPY package.json package-lock.json ./
RUN npm install

# El código se monta mediante volumen en docker-compose
