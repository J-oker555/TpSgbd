// event-booking-service/src/controllers/bookingController.js
const bookingService = require('../services/bookingService');
const bookingRepository = require('../repositories/bookingRepository'); // Pour les lectures

const handleCreateBooking = async (req, res, next) => {
  try {
    const bookingRequest = req.body; // { eventId, userName, numberOfSeats }
    const newBooking = await bookingService.createBooking(bookingRequest);
    res.status(201).json(newBooking);
  } catch (error) {
    // Si l'erreur a un statusCode défini par le service, l'utiliser
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error); // Sinon, passer à la gestion d'erreur globale (500)
  }
};

const getBookingsForEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format."});
    }
    const bookings = await bookingRepository.findByEventId(eventId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    // Pour un vrai système, on extrairait userName d'un token JWT ou d'une session
    // Pour ce TP, on peut le passer en query param ou body (moins sécurisé)
    const userName = req.query.userName;
    if (!userName) {
        return res.status(400).json({ message: "userName query parameter is required."});
    }
    const bookings = await bookingRepository.findByUserName(userName);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  handleCreateBooking,
  getBookingsForEvent,
  getMyBookings,
};