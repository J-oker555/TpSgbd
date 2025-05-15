// event-booking-service/src/app.js
require('dotenv').config({ path: '../../.env' }); // Assurez-vous que .env est chargé
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Importer pour forcer l'initialisation et le log

// Importer les routes (seront créées ensuite)
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Pour les fonctionnalités admin

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Activer CORS pour toutes les routes
app.use(express.json()); // Pour parser les corps de requête JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les corps de requête URL-encoded

// Routes de base
app.get('/', (req, res) => {
  res.send('Event Booking Service is running!');
});

// Monter les routes des modules
// Préfixer par /api pour correspondre à la conf Nginx future
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes); // Endpoints admin préfixés par /admin

// Gestionnaire d'erreurs global simple (à améliorer en production)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Event Booking Service listening on port ${PORT}`);
  console.log(`DB_HOST (from env): ${process.env.DOCKER_DB_HOST || process.env.DB_HOST}`); // Pour débogage
});