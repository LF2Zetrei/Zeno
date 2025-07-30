
# Étape 1 : build
FROM node:20-alpine AS builder
WORKDIR /app

# Copie uniquement les fichiers nécessaires à la build (monorepo-aware)
COPY . .

RUN npm install
RUN npm run build

# Étape 2 : nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Supprime le contenu par défaut de nginx
RUN rm -rf ./*

# Copie les fichiers buildés
COPY --from=builder /app/build .
# ou
# COPY --from=builder /app/apps/web/build .  # si create-react-app

# Copie la config nginx (optionnel mais recommandé)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
