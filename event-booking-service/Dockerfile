# event-booking-service/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force
# Si tu as des devDependencies que tu veux pour une raison, utilise 'npm install'
# Mais pour une image de prod, 'npm ci --only=production' est mieux.

# Copier le reste du code de l'application
COPY . .
# Si tu as un .env que tu veux inclure dans l'image (NON RECOMMANDÉ pour les secrets)
# COPY .env .

# Deuxième étape pour une image plus petite (optionnel mais bonne pratique)
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les node_modules et le code de l'étape builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./package.json
# COPY --from=builder /usr/src/app/.env ./.env # Si copié dans builder

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "node", "src/app.js" ]