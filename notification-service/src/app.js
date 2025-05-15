require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json()); 

app.post('/notify/booking-confirmation', (req, res) => {
  const bookingDetails = req.body;

  console.log('--------------------------------------------------');
  console.log('[Notification Service] Received Booking Confirmation:');
  console.log(`  Booking ID: ${bookingDetails.id}`);
  console.log(`  User Name: ${bookingDetails.userName}`);
  console.log(`  Event ID: ${bookingDetails.eventId}`);
  console.log(`  Seats: ${bookingDetails.numberOfSeats}`);
  console.log(`  Total Price: $${bookingDetails.totalPrice}`);
  console.log('  Status: Notification Logged (Simulated Send)');
  console.log('--------------------------------------------------');



  res.status(200).json({ message: 'Notification logged successfully.' });
});

app.get('/', (req, res) => {
    res.send('Notification Service is running!');
});

app.listen(PORT, () => {
  console.log(`Notification Service listening on port ${PORT}`);
});