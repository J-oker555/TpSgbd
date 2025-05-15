const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Créer une réservation
router.post('/', bookingController.handleCreateBooking);

// Obtenir les réservations pour un événement spécifique (public ou pour le client qui a réservé)
router.get('/event/:eventId', bookingController.getBookingsForEvent);

// Obtenir "mes" réservations (basé sur userName pour ce TP)
router.get('/my-bookings', bookingController.getMyBookings); // ex: /my-bookings?userName=JohnDoe

module.exports = router;