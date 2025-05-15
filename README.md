# TP Architecture Logicielle & Clusters SGBD - Système de Réservation d'Événements

Ce projet est une application de réservation d'événements développée dans le cadre du TP "Architecture Logicielle & Clusters SGBD". Elle met en œuvre une architecture microservices légers avec Node.js, un frontend simple, et un cluster MariaDB Galera pour la haute disponibilité et la cohérence des données.

## Fonctionnalités

*   **Clients :**
    *   Consulter la liste des événements disponibles.
    *   Réserver des places pour un événement.
    *   Recevoir une notification (simulée par un log) de confirmation de réservation.
    *   Consulter ses propres réservations (via l'API, fonctionnalité frontend partielle).
*   **Administrateurs :**
    *   Consulter tous les événements (y compris ceux non disponibles ou annulés).
    *   Créer de nouveaux événements.
    *   Modifier les détails des événements existants (via l'API).
    *   Supprimer des événements.
    *   Consulter toutes les réservations du système (via l'API).

## Architecture

L'application est composée des services suivants, orchestrés avec Docker Compose :

1.  **`event-booking-service` (Node.js/Express) :** Service principal gérant la logique métier des événements et des réservations, l'interaction avec la base de données, et les endpoints API pour les clients et les administrateurs.
2.  **`notification-service` (Node.js/Express) :** Service simplifié qui reçoit les confirmations de réservation et les logue dans sa console (simulation d'envoi de notification).
3.  **`frontend-nginx` (Nginx) :** Sert les fichiers statiques du frontend (HTML, CSS, JS) et agit comme un reverse proxy pour router les appels API vers `event-booking-service`.
4.  **`mariadb-node1`, `mariadb-node2`, `mariadb-node3` (MariaDB/Galera) :** Cluster de base de données MariaDB à 3 nœuds assurant la persistance, la haute disponibilité et la cohérence des données via Galera Cluster.

## Prérequis

*   [Docker](https://www.docker.com/get-started) installé et en cours d'exécution.
*   [Docker Compose](https://docs.docker.com/compose/install/) installé.

## Configuration

Les configurations principales (ports, identifiants de base de données, etc.) sont définies dans le fichier `docker-compose.yml`.
Les scripts d'initialisation de la base de données (création des tables et insertion de données initiales) se trouvent dans le dossier `db_init/`.

**Clé Administrateur pour les Tests :**
Pour accéder aux fonctionnalités d'administration via l'API ou le frontend (si la section admin est fonctionnelle) :
*   Utiliser le header HTTP `X-Admin-Key` avec la valeur : `SUPER_SECRET_ADMIN_KEY`
*   Ou, pour certaines requêtes `GET` via l'URL, ajouter le paramètre `?admin=true` (bien que le header soit la méthode privilégiée pour l'API).

## Lancement de l'Application

1.  **Clonez ce dépôt :**
    ```bash
    git clone https://github.com/J-oker555/TpSgbd.git
    cd TpSgbd
    ```

2.  **Construire les images et démarrer tous les services :**
    Depuis la racine du projet, exécutez :
    ```bash
    docker-compose up --build -d

3.  **Attente du Démarrage :**
    Vous pouvez surveiller les logs des services pour voir leur progression :
    ```bash
    docker-compose logs -f event-booking-service
    docker-compose logs -f mariadb-node1
    docker-compose logs -f frontend-nginx
    ```
    Recherchez les messages indiquant que les services écoutent sur leurs ports et que la connexion à la base de données est réussie.

## Accès à l'Application

*   **Interface Utilisateur (Frontend) :**
    Ouvrez votre navigateur et allez à : [http://localhost:8080](http://localhost:8080)

*   **API (via Nginx) :**
    Les endpoints API sont accessibles sur `http://localhost:8080/api/...`
    *   Exemple (Client - Lister les événements) : `GET http://localhost:8080/api/events`
    *   Exemple (Client - Créer une réservation) : `POST http://localhost:8080/api/bookings`
        *   Body (JSON) : `{ "eventId": 1, "userName": "Nom Utilisateur", "numberOfSeats": 2 }`
    *   Exemple (Admin - Lister tous les événements) : `GET http://localhost:8080/api/admin/events` (avec le header `X-Admin-Key: SUPER_SECRET_ADMIN_KEY`)

## Tests de Haute Disponibilité (Failover MariaDB)

1.  Une fois l'application lancée et fonctionnelle, vous pouvez simuler la panne d'un nœud MariaDB.
2.  Arrêtez l'un des nœuds (par exemple, `mariadb-node2` ou `mariadb-node3` pour commencer) :
    ```bash
    docker-compose stop mariadb-node2
    ```
3.  Continuez à utiliser l'application via le frontend ou Postman. Les opérations de lecture et d'écriture devraient continuer à fonctionner, servies par les nœuds restants du cluster.

4.  Pour redémarrer le nœud :
    ```bash
    docker-compose start mariadb-node2
    ```
    Observez les logs du nœud redémarré pour voir sa resynchronisation avec le cluster.

