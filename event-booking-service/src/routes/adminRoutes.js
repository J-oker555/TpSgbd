const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Appliquer le middleware isAdmin à toutes les routes admin
router.use(adminController.isAdmin);

// Routes pour la gestion des événements par l'admin
router.post('/events', adminController.createEvent);
router.get('/events', adminController.getAllEventsAdmin);
router.get('/events/:id', adminController.getEventByIdAdmin);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Route pour voir toutes les réservations par l'admin
router.get('/bookings', adminController.getAllBookingsAdmin);

module.exports = router;