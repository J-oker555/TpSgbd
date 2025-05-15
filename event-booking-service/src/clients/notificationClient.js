// event-booking-service/src/clients/notificationClient.js
const fetch = require('node-fetch'); // Nécessite node-fetch@2 pour CommonJS
require('dotenv').config({ path: '../../.env' }); // Assurer que .env est chargé pour cette config

const NOTIFICATION_SERVICE_BASE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001';

const sendBookingConfirmationNotification = async (bookingDetails) => {
  if (!NOTIFICATION_SERVICE_BASE_URL) {
    console.warn('NOTIFICATION_SERVICE_URL is not defined. Skipping notification.');
    return;
  }

  try {
    const response = await fetch(`${NOTIFICATION_SERVICE_BASE_URL}/notify/booking-confirmation`, {
      method: 'POST',
      body: JSON.stringify(bookingDetails),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Essayer de lire le corps de l'erreur
      console.error(
        `[NotificationClient] Failed to send booking confirmation. Status: ${response.status}. Body: ${errorBody}`
      );
    } else {
      const result = await response.json();
      console.log(`[NotificationClient] Booking confirmation sent successfully to notification service: ${result.message}`);
    }
  } catch (error) {
    console.error('[NotificationClient] Error sending booking confirmation:', error.message);
    // En production : ajouter des mécanismes de retry, dead-letter queue, etc.
  }
};

module.exports = {
  sendBookingConfirmationNotification,
};