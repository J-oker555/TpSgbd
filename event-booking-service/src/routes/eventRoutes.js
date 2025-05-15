// event-booking-service/src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Pour les clients
router.get('/', eventController.getAvailableEvents);
router.get('/:id', eventController.getEventById);

module.exports = router;