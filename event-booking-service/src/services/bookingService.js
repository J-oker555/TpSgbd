// event-booking-service/src/services/bookingService.js
const pool = require('../config/db');
const eventRepository = require('../repositories/eventRepository');
const bookingRepository = require('../repositories/bookingRepository');
const notificationClient = require('../clients/notificationClient'); // IMPORTER LE CLIENT

const createBooking = async (bookingRequest) => {
  const { eventId, userName, numberOfSeats } = bookingRequest;

  if (!eventId || !userName || !numberOfSeats || numberOfSeats <= 0) {
    const error = new Error('Invalid booking request data.');
    error.statusCode = 400;
    throw error;
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const event = await eventRepository.findById(eventId);
    if (!event) {
      const error = new Error('Event not found or not available.');
      error.statusCode = 404;
      throw error;
    }

    if (event.availableSeats < numberOfSeats) {
      const error = new Error('Not enough seats available for this event.');
      error.statusCode = 409;
      throw error;
    }

    const totalPrice = parseFloat((event.price * numberOfSeats).toFixed(2));

    const seatsDecremented = await eventRepository.decreaseAvailability(eventId, numberOfSeats, connection);
    if (!seatsDecremented) {
      const error = new Error('Failed to reserve seats, possibly already booked by another user or availability changed.');
      error.statusCode = 409;
      throw error;
    }

    const newBooking = await bookingRepository.create(
      { eventId, userName, numberOfSeats, totalPrice, status: 'CONFIRMED' },
      connection
    );

    await connection.commit(); // COMMIT AVANT D'ENVOYER LA NOTIFICATION EXTERNE

    // Appel au service de notification (ne pas attendre la réponse pour ne pas bloquer)
    // C'est un appel "fire-and-forget" pour la notification.
    // En cas d'échec de la notification, la réservation reste valide.
    notificationClient.sendBookingConfirmationNotification(newBooking)
        .catch(err => console.error("Error in fire-and-forget notification call:", err)); // Loguer l'erreur si l'appel lui-même échoue

    console.log(`INFO: Booking ${newBooking.id} confirmed for ${userName}. Notification process initiated.`);
    return newBooking;

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    if (!error.statusCode) {
        console.error("Unhandled error in createBooking:", error);
        error.statusCode = 500;
        error.message = 'An unexpected error occurred while creating the booking.';
    }
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createBooking,
};