// event-booking-service/src/config/db.js
const mysql = require('mysql2/promise');
// Charger .env depuis la racine du service event-booking-service
require('dotenv').config();

// Utiliser des variables d'environnement spécifiques pour le local si DOCKER_DB_HOST n'est pas défini
const dbHost = process.env.DOCKER_DB_HOST || process.env.LOCAL_DB_HOST || 'localhost';
const dbUser = process.env.DOCKER_DB_USER || process.env.LOCAL_DB_USER || 'root'; // ou ton user local
const dbPassword = process.env.DOCKER_DB_PASSWORD || process.env.LOCAL_DB_PASSWORD || ''; // ton mdp local
const dbName = process.env.DOCKER_DB_NAME || process.env.LOCAL_DB_NAME || 'ticketing_db_local';
const dbPort = parseInt(process.env.DOCKER_DB_PORT || process.env.LOCAL_DB_PORT || '3306', 10);

console.log(`Attempting to connect to DB: ${dbHost}:${dbPort} as ${dbUser} to DB ${dbName}`);

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de la connexion (optionnel mais utile)
pool.getConnection()
  .then(connection => {
    console.log(`Successfully connected to the local MariaDB instance on ${dbHost}!`);
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to local MariaDB:');
    console.error(`DBHost: ${dbHost}, DBUser: ${dbUser}, DBName: ${dbName}, DBPort: ${dbPort}`);
    console.error(err.message);
    // Tu pourrais vouloir quitter ici si la connexion DB est critique au démarrage
    // process.exit(1);
  });

module.exports = pool;