FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --only=production && npm cache clean --force
# Si tu as des scripts de build (ex: TypeScript), tu les exécuterais ici.

# Copier le reste du code de l'application
COPY ./src ./src
# Le fichier .env n'est pas copié ici, car on utilisera les variables de docker-compose

# Deuxième étape pour une image plus petite (optionnel mais bonne pratique)
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les node_modules et le code de l'étape builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./package.json

# Exposer le port sur lequel l'application écoute (défini par la variable PORT)
# La valeur réelle du port sera lue depuis les variables d'environnement.
EXPOSE 3000 

# Commande pour démarrer l'application
# L'application lira process.env.PORT pour savoir sur quel port écouter.
CMD [ "node", "src/app.js" ]